package com.refeedx.security;

import com.refeedx.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * Generates and validates the JWTs issued at login/register. The token
 * carries the user's email (as subject), id, and role - enough for the
 * filter to authenticate a request without hitting the database on every
 * call (CustomUserDetailsService still does one lookup to build the
 * authenticated principal, but no separate "is this token real" query).
 */
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * True only if the token is well-formed, unexpired, issued for this
     * exact user, AND that user's account is still active. This is checked
     * on every request (not just at login) because JwtAuthenticationFilter
     * builds the principal fresh from the database each time - so if an
     * Admin deactivates someone mid-session, their very next request is
     * rejected instead of their existing token quietly working for another
     * 24 hours.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String email = extractEmail(token);
            Date expiry = extractClaim(token, Claims::getExpiration);
            return email.equals(userDetails.getUsername())
                    && expiry.after(new Date())
                    && userDetails.isEnabled();
        } catch (JwtException | IllegalArgumentException ex) {
            // Malformed, tampered, or expired token - treat as invalid rather than propagating.
            return false;
        }
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
