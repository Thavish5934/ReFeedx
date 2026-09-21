package com.refeedx.entity.enums;

/**
 * Lifecycle of a FoodRequest post.
 * OPEN -> MATCHED -> FULFILLED -> CLOSED
 */
public enum RequestStatus {
    OPEN,
    MATCHED,
    FULFILLED,
    CLOSED
}
