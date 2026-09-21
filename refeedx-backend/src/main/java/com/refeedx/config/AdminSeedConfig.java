package com.refeedx.config;

import com.refeedx.entity.User;
import com.refeedx.entity.enums.Role;
import com.refeedx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the single ADMIN account on application startup, reading
 * credentials from app.admin.* (see application.yml / env vars).
 * Idempotent - if a user with the configured admin email already exists,
 * this does nothing, so it's safe to run on every boot.
 */
@Component
@RequiredArgsConstructor
public class AdminSeedConfig implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .phone("0000000000")
                .role(Role.ADMIN)
                .active(true)
                .build();

        userRepository.save(admin);
        System.out.println("[ReFeedX] Seeded default Admin account: " + adminEmail);
    }
}
