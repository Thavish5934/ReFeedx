package com.refeedx.dto.response;

import com.refeedx.entity.enums.ContactStatus;

import java.time.LocalDateTime;

public record ContactMessageResponse(
        Long id,
        String name,
        String email,
        String phone,
        String subject,
        String message,
        ContactStatus status,
        LocalDateTime createdAt
) {}
