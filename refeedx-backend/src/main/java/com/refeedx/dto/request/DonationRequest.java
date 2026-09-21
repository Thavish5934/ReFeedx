package com.refeedx.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DonationRequest(
        @NotBlank(message = "Food name is required")
        String foodName,

        @NotBlank(message = "Category is required")
        String category,

        @NotBlank(message = "Quantity is required")
        String quantity,

        @NotNull(message = "Servings is required")
        @Min(value = 1, message = "Servings must be at least 1")
        Integer servings,

        @NotNull(message = "Prepared date/time is required")
        LocalDateTime preparedAt,

        @NotNull(message = "Expiry date/time is required")
        LocalDateTime expiryAt,

        String description,

        @NotBlank(message = "Location is required")
        String location,

        BigDecimal latitude,

        BigDecimal longitude,

        @NotBlank(message = "Contact phone is required")
        String contactPhone
) {}
