package com.refeedx.service;

import com.refeedx.dto.request.FoodRequestRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.FoodRequestResponse;
import com.refeedx.entity.enums.Role;

import java.util.List;

public interface FoodRequestService {

    FoodRequestResponse createRequest(Long requesterId, FoodRequestRequest request);

    List<FoodRequestResponse> getAllRequests(String statusFilter);

    FoodRequestResponse getRequestById(Long id);

    List<FoodRequestResponse> getMyRequests(Long requesterId);

    FoodRequestResponse updateRequest(Long requesterId, Long requestId, FoodRequestRequest request);

    void deleteRequest(Long userId, Role role, Long requestId);

    FoodRequestResponse updateStatus(Long userId, Role role, Long requestId, StatusUpdateRequest request);
}
