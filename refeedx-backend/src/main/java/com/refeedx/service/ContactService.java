package com.refeedx.service;

import com.refeedx.dto.request.ContactRequest;
import com.refeedx.dto.response.ContactMessageResponse;

public interface ContactService {

    /** Public endpoint - no authentication required. */
    ContactMessageResponse submitMessage(ContactRequest request);
}
