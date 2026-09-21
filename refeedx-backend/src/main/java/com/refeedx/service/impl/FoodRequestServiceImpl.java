package com.refeedx.service.impl;

import com.refeedx.dto.request.FoodRequestRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.FoodRequestResponse;
import com.refeedx.entity.FoodRequest;
import com.refeedx.entity.User;
import com.refeedx.entity.enums.RequestStatus;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.AccessDeniedCustomException;
import com.refeedx.exception.BadRequestException;
import com.refeedx.exception.ResourceNotFoundException;
import com.refeedx.mapper.FoodRequestMapper;
import com.refeedx.repository.FoodRequestRepository;
import com.refeedx.service.FoodRequestService;
import com.refeedx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodRequestServiceImpl implements FoodRequestService {

    private final FoodRequestRepository foodRequestRepository;
    private final FoodRequestMapper foodRequestMapper;
    private final UserService userService;

    @Override
    @Transactional
    public FoodRequestResponse createRequest(Long requesterId, FoodRequestRequest request) {
        User requester = userService.getUserEntityById(requesterId);
        FoodRequest foodRequest = foodRequestMapper.toEntity(request, requester);

        return foodRequestMapper.toResponse(foodRequestRepository.save(foodRequest));
    }

    @Override
    public List<FoodRequestResponse> getAllRequests(String statusFilter) {
        List<FoodRequest> requests = (statusFilter != null && !statusFilter.isBlank())
                ? foodRequestRepository.findByStatus(parseStatus(statusFilter))
                : foodRequestRepository.findAll();

        return requests.stream().map(foodRequestMapper::toResponse).toList();
    }

    @Override
    public FoodRequestResponse getRequestById(Long id) {
        return foodRequestMapper.toResponse(getRequestEntity(id));
    }

    @Override
    public List<FoodRequestResponse> getMyRequests(Long requesterId) {
        return foodRequestRepository.findByRequesterId(requesterId).stream()
                .map(foodRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public FoodRequestResponse updateRequest(Long requesterId, Long requestId, FoodRequestRequest request) {
        FoodRequest foodRequest = getRequestEntity(requestId);

        if (!foodRequest.getRequester().getId().equals(requesterId)) {
            throw new AccessDeniedCustomException("You can only edit your own food requests.");
        }

        foodRequestMapper.updateEntity(foodRequest, request);
        return foodRequestMapper.toResponse(foodRequestRepository.save(foodRequest));
    }

    @Override
    @Transactional
    public void deleteRequest(Long userId, Role role, Long requestId) {
        FoodRequest foodRequest = getRequestEntity(requestId);

        boolean isOwner = foodRequest.getRequester().getId().equals(userId);
        boolean isAdmin = role == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedCustomException("You can only delete your own food requests.");
        }

        foodRequestRepository.delete(foodRequest);
    }

    @Override
    @Transactional
    public FoodRequestResponse updateStatus(Long userId, Role role, Long requestId, StatusUpdateRequest request) {
        FoodRequest foodRequest = getRequestEntity(requestId);

        boolean isOwner = foodRequest.getRequester().getId().equals(userId);
        boolean isNgoOrAdmin = role == Role.NGO || role == Role.ADMIN;

        if (!isOwner && !isNgoOrAdmin) {
            throw new AccessDeniedCustomException("You are not allowed to update this request's status.");
        }

        foodRequest.setStatus(parseStatus(request.status()));
        return foodRequestMapper.toResponse(foodRequestRepository.save(foodRequest));
    }

    // ---- helpers ----

    private FoodRequest getRequestEntity(Long id) {
        return foodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + id));
    }

    private RequestStatus parseStatus(String raw) {
        try {
            return RequestStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid request status: " + raw);
        }
    }
}
