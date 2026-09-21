package com.refeedx.service.impl;

import com.refeedx.dto.request.MatchRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.MatchResponse;
import com.refeedx.entity.Donation;
import com.refeedx.entity.FoodRequest;
import com.refeedx.entity.Match;
import com.refeedx.entity.User;
import com.refeedx.entity.enums.DonationStatus;
import com.refeedx.entity.enums.MatchStatus;
import com.refeedx.entity.enums.RequestStatus;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.AccessDeniedCustomException;
import com.refeedx.exception.BadRequestException;
import com.refeedx.exception.ResourceNotFoundException;
import com.refeedx.mapper.MatchMapper;
import com.refeedx.repository.DonationRepository;
import com.refeedx.repository.FoodRequestRepository;
import com.refeedx.repository.MatchRepository;
import com.refeedx.service.MatchService;
import com.refeedx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * A Match is what turns "a donation exists" + "a request exists" into an
 * actual redistribution. Creating one reserves the donation and marks the
 * request matched; completing one closes both out; cancelling one reopens
 * them so they can be matched again.
 */
@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final DonationRepository donationRepository;
    private final FoodRequestRepository foodRequestRepository;
    private final MatchMapper matchMapper;
    private final UserService userService;

    @Override
    @Transactional
    public MatchResponse createMatch(Long userId, Role role, MatchRequest request) {
        Donation donation = donationRepository.findById(request.donationId())
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + request.donationId()));

        FoodRequest foodRequest = foodRequestRepository.findById(request.requestId())
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + request.requestId()));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new BadRequestException("This donation is not available to be matched.");
        }
        if (foodRequest.getStatus() != RequestStatus.OPEN) {
            throw new BadRequestException("This request is not open to be matched.");
        }

        // A DONOR may only match their own donation; a REQUESTER only their own request.
        // An NGO (or Admin) may match any pair, and is recorded as the coordinator.
        if (role == Role.DONOR && !donation.getDonor().getId().equals(userId)) {
            throw new AccessDeniedCustomException("You can only match your own donation.");
        }
        if (role == Role.REQUESTER && !foodRequest.getRequester().getId().equals(userId)) {
            throw new AccessDeniedCustomException("You can only match your own request.");
        }

        User coordinator = (role == Role.NGO) ? userService.getUserEntityById(userId) : null;

        Match match = Match.builder()
                .donation(donation)
                .foodRequest(foodRequest)
                .coordinatedBy(coordinator)
                .status(MatchStatus.PENDING)
                .build();

        donation.setStatus(DonationStatus.RESERVED);
        foodRequest.setStatus(RequestStatus.MATCHED);
        donationRepository.save(donation);
        foodRequestRepository.save(foodRequest);

        return matchMapper.toResponse(matchRepository.save(match));
    }

    @Override
    public MatchResponse getMatchById(Long id) {
        return matchMapper.toResponse(getMatchEntity(id));
    }

    @Override
    public List<MatchResponse> getMatchesForNgo(Long ngoUserId) {
        return matchRepository.findByCoordinatedById(ngoUserId).stream()
                .map(matchMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public MatchResponse updateStatus(Long userId, Role role, Long matchId, StatusUpdateRequest request) {
        Match match = getMatchEntity(matchId);

        boolean isDonor = match.getDonation().getDonor().getId().equals(userId);
        boolean isRequester = match.getFoodRequest().getRequester().getId().equals(userId);
        boolean isCoordinatingNgo = match.getCoordinatedBy() != null && match.getCoordinatedBy().getId().equals(userId);
        boolean isAdmin = role == Role.ADMIN;

        if (!isDonor && !isRequester && !isCoordinatingNgo && !isAdmin) {
            throw new AccessDeniedCustomException("You are not part of this match.");
        }

        MatchStatus newStatus = parseStatus(request.status());
        match.setStatus(newStatus);

        Donation donation = match.getDonation();
        FoodRequest foodRequest = match.getFoodRequest();

        if (newStatus == MatchStatus.COMPLETED) {
            donation.setStatus(DonationStatus.COMPLETED);
            foodRequest.setStatus(RequestStatus.FULFILLED);
        } else if (newStatus == MatchStatus.CANCELLED) {
            // Reopen both sides so they can be matched again.
            donation.setStatus(DonationStatus.AVAILABLE);
            foodRequest.setStatus(RequestStatus.OPEN);
        }

        donationRepository.save(donation);
        foodRequestRepository.save(foodRequest);

        return matchMapper.toResponse(matchRepository.save(match));
    }

    // ---- helpers ----

    private Match getMatchEntity(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
    }

    private MatchStatus parseStatus(String raw) {
        try {
            return MatchStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid match status: " + raw);
        }
    }
}
