package com.refeedx.controller;

import com.refeedx.dto.request.LoginRequest;
import com.refeedx.dto.request.RegisterRequest;
import com.refeedx.dto.response.JwtResponse;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.security.CustomUserPrincipal;
import com.refeedx.service.AuthService;
import com.refeedx.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /** Requires authentication - deliberately NOT covered by the /auth permitAll rule in SecurityConfig. */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(userService.getUserById(principal.getId()));
    }
}
