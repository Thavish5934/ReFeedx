package com.refeedx.dto.response;

import com.refeedx.entity.enums.Role;

/** Returned by POST /auth/login and /auth/register. 'type' is always "Bearer". */
public record JwtResponse(
        String token,
        String type,
        Long userId,
        String name,
        String email,
        Role role
) {
    public JwtResponse(String token, Long userId, String name, String email, Role role) {
        this(token, "Bearer", userId, name, email, role);
    }
}
