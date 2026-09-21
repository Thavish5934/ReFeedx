package com.refeedx.config;

import com.refeedx.security.CustomAccessDeniedHandler;
import com.refeedx.security.CustomAuthenticationEntryPoint;
import com.refeedx.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Real security rules, replacing the Phase 2 placeholder.
 *
 * Route policy (matches the API list in the Phase 1 design doc):
 * - POST /api/auth/register, POST /api/auth/login   public
 * - GET  /api/auth/me                                any authenticated user (NOT covered by the line above)
 * - POST /api/contact                                public (anyone can submit the contact form)
 * - GET  /api/donations/**                           public (matches the public "Donations" nav item)
 * - GET  /api/requests/**                            public (matches the public "Requests" nav item)
 * - /api/admin/**                                     ADMIN only
 * - everything else                                   any authenticated user
 *
 * Finer-grained rules (e.g. "only DONOR may POST /api/donations", "only the
 * owning donor may edit their own donation") are enforced with
 * @PreAuthorize on controllers plus the ownership checks already built into
 * the Phase 3 service layer - a path-based rule here can't express "only
 * the owner", so that responsibility deliberately lives one layer down.
 * Method-level @PreAuthorize checks still apply even on paths that are
 * permitAll here (e.g. GET /api/donations/mine) - permitAll only means
 * "don't reject at the filter level", it doesn't bypass @PreAuthorize.
 */

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Boot auto-wires this to use our CustomUserDetailsService and
     * the PasswordEncoder bean above, since they're the only beans of their
     * kind in the context - no need to hand-build a DaoAuthenticationProvider.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/donations", "/api/donations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/requests", "/api/requests/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Permissive for local development (any localhost port, so the Vite dev
     * server works out of the box). Tighten allowedOriginPatterns to your
     * real frontend domain before deploying.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
