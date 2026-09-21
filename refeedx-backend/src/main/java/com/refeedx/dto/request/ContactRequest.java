package com.refeedx.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Public "Contact Us" submission - no authentication required. */
public record ContactRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String phone,

        @NotBlank(message = "Subject is required")
        String subject,

        @NotBlank(message = "Message is required")
        String message
) {}
