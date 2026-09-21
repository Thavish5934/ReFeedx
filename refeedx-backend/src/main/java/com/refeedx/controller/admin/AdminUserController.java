package com.refeedx.controller.admin;

import com.refeedx.dto.request.ActiveStatusRequest;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.BadRequestException;
import com.refeedx.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Class-level @PreAuthorize is redundant with SecurityConfig's
 * "/api/admin/**" -> hasRole('ADMIN') rule, but kept here as an explicit,
 * self-documenting second line of defense on the controller itself.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers(@RequestParam(required = false) String role) {
        Role roleFilter = null;
        if (role != null && !role.isBlank()) {
            try {
                roleFilter = Role.valueOf(role.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid role: " + role);
            }
        }
        return ResponseEntity.ok(adminService.listUsers(roleFilter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserDetails(id));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<UserResponse> setActive(@PathVariable Long id, @Valid @RequestBody ActiveStatusRequest request) {
        return ResponseEntity.ok(adminService.setUserActive(id, request.active()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
