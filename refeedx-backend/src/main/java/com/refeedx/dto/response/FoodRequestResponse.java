package com.refeedx.dto.response;

import com.refeedx.entity.enums.RequestStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodRequestResponse(
        Long id,
        String foodType,
        String quantity,
        Integer peopleCount,
        LocalDateTime requiredAt,
        String description,
        String location,
        BigDecimal latitude,
        BigDecimal longitude,
        String contactPhone,
        RequestStatus status,
        UserSummaryResponse requester,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
