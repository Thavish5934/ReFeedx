# ReFeedX Frontend

React (Vite) + Tailwind CSS frontend for ReFeedX, wired up against the Spring Boot backend delivered earlier. This covers Phases 7–12 from the original plan in one pass: project setup, Tailwind, auth + role-based routing, dashboards for all four roles, Axios integration, and admin analytics. Maps are handled as "Get Directions" links out to Google Maps rather than an embedded map, per the spec's "keep it simple" note in that section.

## Setup

```bash
npm install
cp .env.example .env   # already done for you; edit if your backend isn't on localhost:8080
npm run dev
```

Open **http://localhost:5173**. Make sure the backend (Phases 2–5) is running on **http://localhost:8080** first — `VITE_API_BASE_URL` in `.env` points there by default, and the backend's CORS config already allows any `localhost` port.

## Design system

Grounded in the actual subject — community fridges and farmers-market crates, not a generic template:

| Token | Value | Used for |
|---|---|---|
| `forest` | `#14301F` | Dark surfaces — nav, footer, hero |
| `leaf` | `#3B7A57` | Primary brand green — buttons, links |
| `marigold` | `#E8A33D` | Donor energy, highlights, CTAs |
| `tomato` | `#C0463A` | Requester/urgency energy, alerts |
| `paper` | `#FBF6EC` | Card surfaces (never full-page background) |
| `ink` | `#24211C` | Body text |

Fonts: **Space Grotesk** (display/headlines), **Inter** (body), **JetBrains Mono** (the stamp badges and stats).

The signature element is the **stamp** (`.stamp` class, see `src/styles/index.css` and `StatusBadge.jsx`) — every donation/request/match/message status renders as an inked rubber-stamp badge instead of a generic colored pill, because the whole platform is really just stamping food's journey from `AVAILABLE` to someone's table. The same visual shows up in the landing page hero as pinned tags on the "community board."

## What's implemented

- **Public site**: Landing (hero, how-it-works, stats, why-ReFeedX, CTA), About, Contact (functional form), and public Donations/Requests browsing — all reachable without logging in.
- **Auth**: Login and Register (with role picker, preset via `?role=DONOR` from the landing page's CTAs), backed by `AuthContext` and the JWT stored in `localStorage`. A 401 from any API call triggers an automatic logout.
- **Role-based routing**: `ProtectedRoute` blocks unauthenticated users and wrong-role users from each dashboard.
- **Donor**: dashboard with stats, full CRUD on own donations (create/edit/delete/status update) in one page.
- **Requester**: same, mirrored for requests.
- **NGO**: side-by-side available-donations / open-requests board — tap one of each to pair them, confirm to create a Match, then track and progress every match you've coordinated.
- **Admin**: full analytics dashboard (every field from the backend's `AnalyticsResponse`), plus user management (activate/deactivate/delete), and moderation views for all donations, requests, and contact messages.

## What's intentionally not here yet

- **Visual polish pass** (Phase 13 in the original plan) — micro-interactions, loading skeletons, finer responsive tuning. The current build is fully functional and reasonably polished, but hasn't had a dedicated refinement pass.
- **Embedded maps** — "Get Directions" opens Google Maps in a new tab rather than showing an inline map, matching the spec's note to keep location handling simple.
- **Image uploads, pagination, notifications** — none of these are in the backend either (see the backend README's own "intentionally not here yet" section); the frontend doesn't invent UI for features the API doesn't support.

## Project structure

```
src/
├── api/axios.js              # axios instance + JWT interceptor + central 401 handling
├── components/
│   ├── common/                # Navbar, Footer, StatusBadge (the stamp), Loading/Empty/Error states
│   ├── cards/                 # DonationCard, RequestCard (selectable for NGO matching), StatCard
│   └── forms/                 # DonationForm, RequestForm (shared between create and edit)
├── context/AuthContext.jsx    # token/user state, login/register/logout
├── layouts/                   # PublicLayout (site chrome), DashboardLayout (app chrome)
├── pages/
│   ├── public/                 # Landing, About, Contact, DonationsPublic, RequestsPublic, NotFound
│   ├── auth/                   # Login, Register
│   ├── donor/, requester/      # Dashboard + full management page per role
│   ├── ngo/                    # NgoDashboard (matching board)
│   └── admin/                  # AdminDashboard (analytics) + Users/Donations/Requests/Messages
├── routes/AppRoutes.jsx, ProtectedRoute.jsx
├── services/                   # one file per backend resource, thin wrappers over axios
└── utils/                      # error message extraction, date formatting, map link building
```

## Verified

`npm run build` and `npx eslint src` both run clean (one harmless Fast-Refresh warning on the context file, which is expected for any file exporting both a provider and a hook).
