package com.refeedx.dto.response;

import com.refeedx.entity.enums.DonationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DonationResponse(
        Long id,
        String foodName,
        String category,
        String quantity,
        Integer servings,
        LocalDateTime preparedAt,
        LocalDateTime expiryAt,
        String description,
        String location,
        BigDecimal latitude,
        BigDecimal longitude,
        String contactPhone,
        DonationStatus status,
        UserSummaryResponse donor,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
