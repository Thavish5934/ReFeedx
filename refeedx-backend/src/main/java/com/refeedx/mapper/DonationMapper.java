package com.refeedx.mapper;

import com.refeedx.dto.request.DonationRequest;
import com.refeedx.dto.response.DonationResponse;
import com.refeedx.entity.Donation;
import com.refeedx.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DonationMapper {

    private final UserMapper userMapper;

    public DonationResponse toResponse(Donation donation) {
        if (donation == null) return null;

        return new DonationResponse(
                donation.getId(),
                donation.getFoodName(),
                donation.getCategory(),
                donation.getQuantity(),
                donation.getServings(),
                donation.getPreparedAt(),
                donation.getExpiryAt(),
                donation.getDescription(),
                donation.getLocation(),
                donation.getLatitude(),
                donation.getLongitude(),
                donation.getContactPhone(),
                donation.getStatus(),
                userMapper.toSummary(donation.getDonor()),
                donation.getCreatedAt(),
                donation.getUpdatedAt()
        );
    }

    /** Builds a new Donation from a create request. The donor and status/timestamps are set by the service. */
    public Donation toEntity(DonationRequest request, User donor) {
        return Donation.builder()
                .foodName(request.foodName())
                .category(request.category())
                .quantity(request.quantity())
                .servings(request.servings())
                .preparedAt(request.preparedAt())
                .expiryAt(request.expiryAt())
                .description(request.description())
                .location(request.location())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .contactPhone(request.contactPhone())
                .donor(donor)
                .build();
    }

    /** Applies edits from an update request onto an existing, already-loaded Donation. */
    public void updateEntity(Donation donation, DonationRequest request) {
        donation.setFoodName(request.foodName());
        donation.setCategory(request.category());
        donation.setQuantity(request.quantity());
        donation.setServings(request.servings());
        donation.setPreparedAt(request.preparedAt());
        donation.setExpiryAt(request.expiryAt());
        donation.setDescription(request.description());
        donation.setLocation(request.location());
        donation.setLatitude(request.latitude());
        donation.setLongitude(request.longitude());
        donation.setContactPhone(request.contactPhone());
    }
}
