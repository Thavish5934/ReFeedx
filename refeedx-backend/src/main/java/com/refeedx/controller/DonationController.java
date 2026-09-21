package com.refeedx.controller;

import com.refeedx.dto.request.DonationRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.DonationResponse;
import com.refeedx.security.CustomUserPrincipal;
import com.refeedx.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    /** DONOR only - service layer has no other role check for creation, so it belongs here. */
    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationResponse> createDonation(
            @Valid @RequestBody DonationRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        DonationResponse created = donationService.createDonation(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Public - powers the landing page's Donations browsing, logged in or not. */
    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(donationService.getAllDonations(status, category));
    }

    /** DONOR only. Placed above "/{id}" so Spring routes the literal "mine" segment here, not as an id. */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<DonationResponse>> getMyDonations(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(donationService.getMyDonations(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonation(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    /** Ownership is enforced inside DonationService, not here. */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationResponse> updateDonation(
            @PathVariable Long id,
            @Valid @RequestBody DonationRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(donationService.updateDonation(principal.getId(), id, request));
    }

    /** Owning donor or Admin - DonationService checks which. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        donationService.deleteDonation(principal.getId(), principal.getRole(), id);
        return ResponseEntity.noContent().build();
    }

    /** Owning donor, any NGO, or Admin - DonationService checks which. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(donationService.updateStatus(principal.getId(), principal.getRole(), id, request));
    }
}
