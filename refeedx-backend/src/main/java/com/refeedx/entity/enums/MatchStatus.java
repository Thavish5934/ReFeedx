package com.refeedx.entity.enums;

/**
 * Lifecycle of a Match (a Donation linked to a FoodRequest, optionally
 * coordinated by an NGO).
 */
public enum MatchStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED
}
