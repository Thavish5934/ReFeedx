package com.refeedx.controller;

import com.refeedx.dto.request.MatchRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.MatchResponse;
import com.refeedx.security.CustomUserPrincipal;
import com.refeedx.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Not in the original section-18 API sketch, but necessary once a Donation
 * and a FoodRequest need to be linked - see the Match entity and §2.5 of
 * the Phase 1 design doc. DONOR, REQUESTER, NGO, and ADMIN may all create a
 * match; MatchService decides exactly what each of them is allowed to
 * match, so no @PreAuthorize role gate is needed on creation itself.
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(
            @Valid @RequestBody MatchRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        MatchResponse created = matchService.createMatch(principal.getId(), principal.getRole(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> getMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    /** The matches a given NGO is coordinating. */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<MatchResponse>> getMyCoordinatedMatches(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(matchService.getMatchesForNgo(principal.getId()));
    }

    /** Owning donor, owning requester, coordinating NGO, or Admin - MatchService checks which. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<MatchResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        return ResponseEntity.ok(matchService.updateStatus(principal.getId(), principal.getRole(), id, request));
    }
}
