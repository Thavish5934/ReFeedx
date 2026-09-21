package com.refeedx.dto.request;

import jakarta.validation.constraints.NotNull;

/** Body for PATCH /api/admin/users/{id}/active. */
public record ActiveStatusRequest(
        @NotNull(message = "active is required")
        Boolean active
) {}
