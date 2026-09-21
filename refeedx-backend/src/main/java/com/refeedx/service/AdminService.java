package com.refeedx.service;

import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.*;
import com.refeedx.entity.enums.Role;

import java.util.List;

public interface AdminService {

    List<UserResponse> listUsers(Role roleFilter);

    UserResponse getUserDetails(Long id);

    UserResponse setUserActive(Long id, boolean active);

    void deleteUser(Long id);

    List<DonationResponse> listAllDonations();

    void deleteDonation(Long id);

    List<FoodRequestResponse> listAllRequests();

    void deleteRequest(Long id);

    List<ContactMessageResponse> listMessages(String statusFilter);

    ContactMessageResponse updateMessageStatus(Long id, StatusUpdateRequest request);

    void deleteMessage(Long id);

    AnalyticsResponse getAnalytics();
}
