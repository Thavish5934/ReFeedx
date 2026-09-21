package com.refeedx.dto.response;

import com.refeedx.entity.enums.MatchStatus;

import java.time.LocalDateTime;

public record MatchResponse(
        Long id,
        DonationResponse donation,
        FoodRequestResponse foodRequest,
        UserSummaryResponse coordinatedBy,
        MatchStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
