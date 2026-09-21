package com.refeedx.service;

import com.refeedx.dto.request.DonationRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.DonationResponse;
import com.refeedx.entity.enums.Role;

import java.util.List;

public interface DonationService {

    DonationResponse createDonation(Long donorId, DonationRequest request);

    List<DonationResponse> getAllDonations(String statusFilter, String categoryFilter);

    DonationResponse getDonationById(Long id);

    List<DonationResponse> getMyDonations(Long donorId);

    /** Only the owning donor may edit. */
    DonationResponse updateDonation(Long donorId, Long donationId, DonationRequest request);

    /** Owning donor or Admin may delete. */
    void deleteDonation(Long userId, Role role, Long donationId);

    /** Owning donor, any NGO, or Admin may change status. */
    DonationResponse updateStatus(Long userId, Role role, Long donationId, StatusUpdateRequest request);
}
