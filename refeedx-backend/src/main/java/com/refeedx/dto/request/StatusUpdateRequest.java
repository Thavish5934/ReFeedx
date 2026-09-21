package com.refeedx.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Generic status-change payload, reused for Donation, FoodRequest, Match,
 * and ContactMessage status transitions. The service layer parses 'status'
 * into the correct enum and validates it's a legal value for that entity.
 */
public record StatusUpdateRequest(
        @NotBlank(message = "Status is required")
        String status
) {}
