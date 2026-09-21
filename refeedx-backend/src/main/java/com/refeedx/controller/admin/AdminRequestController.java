package com.refeedx.controller.admin;

import com.refeedx.dto.response.FoodRequestResponse;
import com.refeedx.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRequestController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<FoodRequestResponse>> listAllRequests() {
        return ResponseEntity.ok(adminService.listAllRequests());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        adminService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
