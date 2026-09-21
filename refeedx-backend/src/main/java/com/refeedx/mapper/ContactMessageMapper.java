package com.refeedx.mapper;

import com.refeedx.dto.request.ContactRequest;
import com.refeedx.dto.response.ContactMessageResponse;
import com.refeedx.entity.ContactMessage;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    public ContactMessageResponse toResponse(ContactMessage message) {
        if (message == null) return null;

        return new ContactMessageResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getPhone(),
                message.getSubject(),
                message.getMessage(),
                message.getStatus(),
                message.getCreatedAt()
        );
    }

    public ContactMessage toEntity(ContactRequest request) {
        return ContactMessage.builder()
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .subject(request.subject())
                .message(request.message())
                .build();
    }
}
