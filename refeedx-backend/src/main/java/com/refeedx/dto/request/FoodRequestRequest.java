package com.refeedx.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodRequestRequest(
        @NotBlank(message = "Food type is required")
        String foodType,

        @NotBlank(message = "Quantity is required")
        String quantity,

        @NotNull(message = "Number of people is required")
        @Min(value = 1, message = "Number of people must be at least 1")
        Integer peopleCount,

        @NotNull(message = "Required date/time is required")
        LocalDateTime requiredAt,

        String description,

        @NotBlank(message = "Location is required")
        String location,

        BigDecimal latitude,

        BigDecimal longitude,

        @NotBlank(message = "Contact phone is required")
        String contactPhone
) {}
