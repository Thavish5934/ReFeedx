package com.refeedx.entity.enums;

/**
 * Lifecycle of a Donation post.
 * AVAILABLE -> RESERVED -> COLLECTED -> COMPLETED
 * (or -> EXPIRED once expiryAt has passed, regardless of prior state)
 */
public enum DonationStatus {
    AVAILABLE,
    RESERVED,
    COLLECTED,
    COMPLETED,
    EXPIRED
}
