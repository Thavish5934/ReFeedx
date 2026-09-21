package com.refeedx.dto.response;

import com.refeedx.entity.enums.Role;

import java.time.LocalDateTime;

/** Full profile view - returned for "my profile" and Admin's user-detail screen. Never includes the password. */
public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        Role role,
        Boolean active,
        LocalDateTime createdAt
) {}
