package com.refeedx.dto.request;

import jakarta.validation.constraints.NotNull;

public record MatchRequest(
        @NotNull(message = "Donation id is required")
        Long donationId,

        @NotNull(message = "Request id is required")
        Long requestId
) {}
