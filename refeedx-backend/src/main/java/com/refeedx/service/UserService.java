package com.refeedx.service;

import com.refeedx.dto.request.ChangePasswordRequest;
import com.refeedx.dto.request.RegisterRequest;
import com.refeedx.dto.request.UpdateProfileRequest;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.entity.User;

public interface UserService {

    /** Registers a REQUESTER, DONOR, or NGO. Rejects role=ADMIN. */
    UserResponse registerUser(RegisterRequest request);

    UserResponse getUserById(Long id);

    /** Internal helper for other services that need the full entity (e.g. to set as donor/requester). */
    User getUserEntityById(Long id);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);
}
