package com.refeedx.service;

import com.refeedx.dto.request.LoginRequest;
import com.refeedx.dto.request.RegisterRequest;
import com.refeedx.dto.response.JwtResponse;

public interface AuthService {

    /** Registers a new REQUESTER/DONOR/NGO and immediately logs them in (returns a usable token). */
    JwtResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);
}
