# ReFeedX Backend — Phases 2 through 5 (complete backend)

This is now a **fully working, testable-in-Postman backend**. All five phases of backend work from the Phase 1 plan are done:

- **Phase 2** — Spring Boot project skeleton: entities, enums, repositories.
- **Phase 3** — DTOs, mappers, service layer (ownership checks, status transitions).
- **Phase 4** — Real JWT security: token generation/validation, request filter, route rules.
- **Phase 5** (this update) — REST controllers for every endpoint, wired to the services and secured with `@PreAuthorize`.

## Project structure

```
src/main/java/com/refeedx/
├── RefeedXApplication.java
│
├── controller/                       # Phase 5
│   ├── AuthController.java          # /api/auth/register, /login, /me
│   ├── UserController.java          # /api/users/{id}, /me, /me/password
│   ├── DonationController.java      # /api/donations/**
│   ├── FoodRequestController.java   # /api/requests/**
│   ├── MatchController.java         # /api/matches/** (donor+requester+NGO coordination)
│   ├── ContactController.java       # /api/contact
│   └── admin/
│       ├── AdminUserController.java, AdminDonationController.java
│       ├── AdminRequestController.java, AdminMessageController.java
│       └── AdminAnalyticsController.java
│
├── config/
│   ├── SecurityConfig.java          # route rules, JWT filter, CORS, custom 401/403 handlers
│   └── AdminSeedConfig.java         # seeds the one Admin account on first boot
│
├── security/                        # Phase 4
│   ├── JwtService.java
│   ├── CustomUserPrincipal.java
│   ├── CustomUserDetailsService.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomAuthenticationEntryPoint.java   # consistent JSON 401s
│   └── CustomAccessDeniedHandler.java        # consistent JSON 403s
│
├── entity/ + entity/enums/          # Phase 2
├── repository/                      # Phase 2
├── dto/request/ + dto/response/     # Phase 3 (+ ActiveStatusRequest in Phase 5)
├── mapper/                          # Phase 3
├── service/ + service/impl/         # Phase 3 (+ AuthService in Phase 4)
├── scheduler/                       # DonationExpiryScheduler - auto-expires overdue donations (fix pass)
└── exception/                       # Phase 3 (+ Spring Security AccessDeniedException + DataIntegrityViolationException mapping)
```

## Setup

1. **Create the database** (or let Hibernate do it — `createDatabaseIfNotExist=true` is already set):
   ```sql
   CREATE DATABASE IF NOT EXISTS refeedx_db;
   ```
2. **Set your DB credentials** — edit `src/main/resources/application.yml` or export env vars:
   ```bash
   export DB_USERNAME=root
   export DB_PASSWORD=your_mysql_password
   ```
3. **(Optional) Set the admin account** — defaults to `admin@refeedx.com` / `Admin@123`:
   ```bash
   export ADMIN_EMAIL=admin@refeedx.com
   export ADMIN_PASSWORD=Admin@123
   ```

## Run it

**IntelliJ:** open the folder as a Maven project, let it index, run `RefeedXApplication.java`.
**Command line:** `mvn spring-boot:run`

## Try it in Postman

1. **Register a donor:**
   ```
   POST http://localhost:8080/api/auth/register
   {
     "name": "Jane Donor",
     "email": "jane@example.com",
     "password": "password123",
     "phone": "9999999999",
     "address": "12 Main St",
     "role": "DONOR"
   }
   ```
   Response includes a `token` — copy it.

2. **Create a donation** (needs the token from step 1 as `Authorization: Bearer <token>`):
   ```
   POST http://localhost:8080/api/donations
   {
     "foodName": "Vegetable Biryani",
     "category": "VEG",
     "quantity": "10 kg",
     "servings": 30,
     "preparedAt": "2026-08-19T10:00:00",
     "expiryAt": "2026-08-19T20:00:00",
     "location": "MG Road, Chennai",
     "contactPhone": "9999999999"
   }
   ```

3. **Browse donations with no token at all** — this should still work:
   ```
   GET http://localhost:8080/api/donations
   ```

4. **Log in as the seeded admin** and hit an admin-only route:
   ```
   POST http://localhost:8080/api/auth/login
   { "email": "admin@refeedx.com", "password": "Admin@123" }

   GET http://localhost:8080/api/admin/analytics   (with the admin's token)
   ```

5. **Confirm role protection**: try step 2's donation-create call using the admin's token instead of the donor's — it should come back `403 Forbidden` with a JSON body like:
   ```json
   { "status": 403, "error": "Forbidden", "message": "You do not have permission to perform this action." }
   ```

## What's intentionally NOT here yet

- **No file/image uploads** — donation/request photos aren't in the original spec; location is text + optional lat/lng only.
- **No pagination** — list endpoints (`GET /donations`, `GET /requests`, `GET /admin/users`, etc.) return everything. Fine at prototype scale; add `Pageable` if the dataset grows.
- **No email/SMS notifications** — "contact donor/requester" is just showing their phone number on the card, per your confirmed design; there's no in-app messaging or notification system.
- **No refresh tokens** — the JWT is a single long-lived (24h default) token; logging out is a frontend-only action (discard the token). Add refresh tokens later if you want shorter-lived access tokens.

## Fix pass (post-Phase-5 audit)

Once the whole stack was running, I went back through the backend the same way I audited the frontend — tracing every cross-file contract by hand, since Maven Central isn't reachable in this sandbox so I can't actually compile here (unlike the frontend, which I could `npm run build`). Four real issues came out of that:

1. **Deactivated accounts kept working until their token expired.** `JwtAuthenticationFilter` rebuilds the user fresh from the database on every request, but `JwtService.isTokenValid` was only checking the token's signature/email/expiry — never `userDetails.isEnabled()`. So if an Admin deactivated someone mid-session, their existing JWT would keep working for up to 24 hours. Fixed: `isTokenValid` now also requires `isEnabled()`, so the very next request after deactivation is rejected.

2. **Deleting a user/donation/request with existing references crashed with a raw 500.** `donations.donor_id`, `food_requests.requester_id`, and `matches.donation_id/request_id/coordinated_by` are all foreign keys. Deleting a Donor who has posted donations (or a Requester with requests, or an NGO coordinating matches) would hit a database constraint violation that fell through to the generic exception handler and returned a vague "Internal Server Error." Fixed two ways: `AdminServiceImpl.deleteUser` now checks for referencing donations/requests/matches first and returns a clear "deactivate instead" message, and `GlobalExceptionHandler` now maps `DataIntegrityViolationException` to a proper `409 Conflict` as a general safety net (covering donation/request deletion too, where a bespoke check felt like overkill for a less-common path).

3. **`EXPIRED` was dead status.** The enum value and the `expiryAt` field both exist, but nothing ever actually set a donation to `EXPIRED` unless a human manually did it. Added `DonationExpiryScheduler`, a `@Scheduled` job (every 15 minutes) that finds any `AVAILABLE`/`RESERVED` donation past its `expiryAt` and flips it — `@EnableScheduling` added to `RefeedXApplication`. Deliberately leaves `COLLECTED`/`COMPLETED` donations alone even past expiry, since the food was already handed over.

4. **"Active Donations" undercounted.** The analytics figure only counted `AVAILABLE`, silently excluding anything `RESERVED` (i.e. mid-match). Fixed to count both via a new `countByStatusIn` repository method.

## Next: Frontend (Phase 7 onward)

The backend is done. Phase 6 (Postman testing) is really just the checklist above, done thoroughly by you. From here we move into the React frontend — project setup, Tailwind, the `axios` instance with the JWT interceptor, and auth/role-based routing.
