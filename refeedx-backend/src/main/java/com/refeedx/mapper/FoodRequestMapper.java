package com.refeedx.mapper;

import com.refeedx.dto.request.FoodRequestRequest;
import com.refeedx.dto.response.FoodRequestResponse;
import com.refeedx.entity.FoodRequest;
import com.refeedx.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FoodRequestMapper {

    private final UserMapper userMapper;

    public FoodRequestResponse toResponse(FoodRequest foodRequest) {
        if (foodRequest == null) return null;

        return new FoodRequestResponse(
                foodRequest.getId(),
                foodRequest.getFoodType(),
                foodRequest.getQuantity(),
                foodRequest.getPeopleCount(),
                foodRequest.getRequiredAt(),
                foodRequest.getDescription(),
                foodRequest.getLocation(),
                foodRequest.getLatitude(),
                foodRequest.getLongitude(),
                foodRequest.getContactPhone(),
                foodRequest.getStatus(),
                userMapper.toSummary(foodRequest.getRequester()),
                foodRequest.getCreatedAt(),
                foodRequest.getUpdatedAt()
        );
    }

    public FoodRequest toEntity(FoodRequestRequest request, User requester) {
        return FoodRequest.builder()
                .foodType(request.foodType())
                .quantity(request.quantity())
                .peopleCount(request.peopleCount())
                .requiredAt(request.requiredAt())
                .description(request.description())
                .location(request.location())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .contactPhone(request.contactPhone())
                .requester(requester)
                .build();
    }

    public void updateEntity(FoodRequest foodRequest, FoodRequestRequest request) {
        foodRequest.setFoodType(request.foodType());
        foodRequest.setQuantity(request.quantity());
        foodRequest.setPeopleCount(request.peopleCount());
        foodRequest.setRequiredAt(request.requiredAt());
        foodRequest.setDescription(request.description());
        foodRequest.setLocation(request.location());
        foodRequest.setLatitude(request.latitude());
        foodRequest.setLongitude(request.longitude());
        foodRequest.setContactPhone(request.contactPhone());
    }
}
