package com.refeedx.dto.request;

import com.refeedx.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Self-registration payload for REQUESTER, DONOR, and NGO.
 * 'role' must not be ADMIN - AuthService rejects that explicitly, since
 * there is no public path to create an admin account.
 */
public record RegisterRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Phone is required")
        String phone,

        String address,

        @NotNull(message = "Role is required")
        Role role
) {}
