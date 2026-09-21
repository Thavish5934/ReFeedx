package com.refeedx.service.impl;

import com.refeedx.dto.request.ContactRequest;
import com.refeedx.dto.response.ContactMessageResponse;
import com.refeedx.entity.ContactMessage;
import com.refeedx.mapper.ContactMessageMapper;
import com.refeedx.repository.ContactMessageRepository;
import com.refeedx.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageMapper contactMessageMapper;

    @Override
    @Transactional
    public ContactMessageResponse submitMessage(ContactRequest request) {
        ContactMessage message = contactMessageMapper.toEntity(request);
        return contactMessageMapper.toResponse(contactMessageRepository.save(message));
    }
}
