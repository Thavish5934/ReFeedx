package com.refeedx.controller.admin;

import com.refeedx.dto.response.DonationResponse;
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
@RequestMapping("/api/admin/donations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDonationController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<DonationResponse>> listAllDonations() {
        return ResponseEntity.ok(adminService.listAllDonations());
    }

    /** For removing inappropriate or spam donation posts. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        adminService.deleteDonation(id);
        return ResponseEntity.noContent().build();
    }
}
