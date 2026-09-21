package com.refeedx.repository;

import com.refeedx.entity.ContactMessage;
import com.refeedx.entity.enums.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByStatus(ContactStatus status);

    long countByStatus(ContactStatus status);
}
