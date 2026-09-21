package com.refeedx.controller;

import com.refeedx.dto.request.ChangePasswordRequest;
import com.refeedx.dto.request.UpdateProfileRequest;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.AccessDeniedCustomException;
import com.refeedx.security.CustomUserPrincipal;
import com.refeedx.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** Any authenticated user may fetch their own profile; only Admin may look up someone else's. */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        if (!principal.getId().equals(id) && principal.getRole() != Role.ADMIN) {
            throw new AccessDeniedCustomException("You can only view your own profile.");
        }
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /** Update your own profile. There is no path variant for editing someone else's profile. */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changeMyPassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.noContent().build();
    }
}
