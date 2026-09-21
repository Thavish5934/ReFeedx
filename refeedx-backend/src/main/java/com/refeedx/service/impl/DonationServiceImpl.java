package com.refeedx.service.impl;

import com.refeedx.dto.request.DonationRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.DonationResponse;
import com.refeedx.entity.Donation;
import com.refeedx.entity.User;
import com.refeedx.entity.enums.DonationStatus;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.AccessDeniedCustomException;
import com.refeedx.exception.BadRequestException;
import com.refeedx.exception.ResourceNotFoundException;
import com.refeedx.mapper.DonationMapper;
import com.refeedx.repository.DonationRepository;
import com.refeedx.service.DonationService;
import com.refeedx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final DonationMapper donationMapper;
    private final UserService userService;

    @Override
    @Transactional
    public DonationResponse createDonation(Long donorId, DonationRequest request) {
        validateDates(request.preparedAt(), request.expiryAt());

        User donor = userService.getUserEntityById(donorId);
        Donation donation = donationMapper.toEntity(request, donor);

        return donationMapper.toResponse(donationRepository.save(donation));
    }

    @Override
    public List<DonationResponse> getAllDonations(String statusFilter, String categoryFilter) {
        List<Donation> donations;

        if (statusFilter != null && !statusFilter.isBlank()) {
            donations = donationRepository.findByStatus(parseStatus(statusFilter));
        } else {
            donations = donationRepository.findAll();
        }

        if (categoryFilter != null && !categoryFilter.isBlank()) {
            donations = donations.stream()
                    .filter(d -> d.getCategory().equalsIgnoreCase(categoryFilter))
                    .toList();
        }

        return donations.stream().map(donationMapper::toResponse).toList();
    }

    @Override
    public DonationResponse getDonationById(Long id) {
        return donationMapper.toResponse(getDonationEntity(id));
    }

    @Override
    public List<DonationResponse> getMyDonations(Long donorId) {
        return donationRepository.findByDonorId(donorId).stream()
                .map(donationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public DonationResponse updateDonation(Long donorId, Long donationId, DonationRequest request) {
        Donation donation = getDonationEntity(donationId);

        if (!donation.getDonor().getId().equals(donorId)) {
            throw new AccessDeniedCustomException("You can only edit your own donations.");
        }

        validateDates(request.preparedAt(), request.expiryAt());
        donationMapper.updateEntity(donation, request);

        return donationMapper.toResponse(donationRepository.save(donation));
    }

    @Override
    @Transactional
    public void deleteDonation(Long userId, Role role, Long donationId) {
        Donation donation = getDonationEntity(donationId);

        boolean isOwner = donation.getDonor().getId().equals(userId);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedCustomException("You can only delete your own donations.");
        }

        donationRepository.delete(donation);
    }

    @Override
    @Transactional
    public DonationResponse updateStatus(Long userId, Role role, Long donationId, StatusUpdateRequest request) {
        Donation donation = getDonationEntity(donationId);

        boolean isOwner = donation.getDonor().getId().equals(userId);
        boolean isNgoOrAdmin = role == Role.NGO || role == Role.ADMIN;

        if (!isOwner && !isNgoOrAdmin) {
            throw new AccessDeniedCustomException("You are not allowed to update this donation's status.");
        }

        donation.setStatus(parseStatus(request.status()));
        return donationMapper.toResponse(donationRepository.save(donation));
    }

    // ---- helpers ----

    private Donation getDonationEntity(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
    }

    private DonationStatus parseStatus(String raw) {
        try {
            return DonationStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid donation status: " + raw);
        }
    }

    private void validateDates(java.time.LocalDateTime preparedAt, java.time.LocalDateTime expiryAt) {
        if (expiryAt.isBefore(preparedAt)) {
            throw new BadRequestException("Expiry date/time must be after the prepared date/time.");
        }
    }
}
