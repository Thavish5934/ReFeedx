package com.refeedx.entity.enums;

/**
 * The four user roles in ReFeedX. There is exactly one ADMIN, seeded on
 * first boot (see AdminSeedConfig) - it is never assigned through
 * /auth/register.
 */
public enum Role {
    ADMIN,
    REQUESTER,
    DONOR,
    NGO
}
