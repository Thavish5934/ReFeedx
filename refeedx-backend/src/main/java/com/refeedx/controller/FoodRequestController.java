package com.refeedx.controller;

import com.refeedx.dto.request.FoodRequestRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.FoodRequestResponse;
import com.refeedx.security.CustomUserPrincipal;
import com.refeedx.service.FoodRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class FoodRequestController {

    private final FoodRequestService foodRequestService;

    @PostMapping
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<FoodRequestResponse> createRequest(
            @Valid @RequestBody FoodRequestRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        FoodRequestResponse created = foodRequestService.createRequest(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Public - powers the landing page's Requests browsing, logged in or not. */
    @GetMapping
    public ResponseEntity<List<FoodRequestResponse>> getAllRequests(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(foodRequestService.getAllRequests(status));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<List<FoodRequestResponse>> getMyRequests(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(foodRequestService.getMyRequests(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodRequestResponse> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(foodRequestService.getRequestById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('REQUESTER')")
    public ResponseEntity<FoodRequestResponse> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody FoodRequestRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(foodRequestService.updateRequest(principal.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        foodRequestService.deleteRequest(principal.getId(), principal.getRole(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FoodRequestResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(foodRequestService.updateStatus(principal.getId(), principal.getRole(), id, request));
    }
}
