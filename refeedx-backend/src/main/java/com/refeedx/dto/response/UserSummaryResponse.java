package com.refeedx.dto.response;

/**
 * Lightweight, embeddable view of a User - used inside DonationResponse /
 * FoodRequestResponse / MatchResponse so a requester can see "who is the
 * donor" without the API exposing full account details (email is
 * intentionally omitted; contact happens via the phone on the post itself).
 */
public record UserSummaryResponse(
        Long id,
        String name,
        String phone
) {}
