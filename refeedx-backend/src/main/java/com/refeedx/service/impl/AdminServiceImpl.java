package com.refeedx.service.impl;

import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.*;
import com.refeedx.entity.ContactMessage;
import com.refeedx.entity.Donation;
import com.refeedx.entity.FoodRequest;
import com.refeedx.entity.User;
import com.refeedx.entity.enums.*;
import com.refeedx.exception.BadRequestException;
import com.refeedx.exception.ResourceNotFoundException;
import com.refeedx.mapper.ContactMessageMapper;
import com.refeedx.mapper.DonationMapper;
import com.refeedx.mapper.FoodRequestMapper;
import com.refeedx.mapper.UserMapper;
import com.refeedx.repository.*;
import com.refeedx.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final FoodRequestRepository foodRequestRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final MatchRepository matchRepository;

    private final UserMapper userMapper;
    private final DonationMapper donationMapper;
    private final FoodRequestMapper foodRequestMapper;
    private final ContactMessageMapper contactMessageMapper;

    // ---- Users ----

    @Override
    public List<UserResponse> listUsers(Role roleFilter) {
        List<User> users = (roleFilter != null) ? userRepository.findByRole(roleFilter) : userRepository.findAll();
        return users.stream().map(userMapper::toResponse).toList();
    }

    @Override
    public UserResponse getUserDetails(Long id) {
        return userMapper.toResponse(getUserEntity(id));
    }

    @Override
    @Transactional
    public UserResponse setUserActive(Long id, boolean active) {
        User user = getUserEntity(id);
        user.setActive(active);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserEntity(id);

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("The Admin account cannot be deleted.");
        }

        // Donations/requests/matches all have a NOT NULL (or FK-constrained)
        // reference back to the user who created/coordinated them, so a raw
        // delete here would fail at the database level with an opaque error.
        // Give the admin a clear, actionable reason instead.
        boolean hasDonations = !donationRepository.findByDonorId(id).isEmpty();
        boolean hasRequests = !foodRequestRepository.findByRequesterId(id).isEmpty();
        boolean hasCoordinatedMatches = !matchRepository.findByCoordinatedById(id).isEmpty();

        if (hasDonations || hasRequests || hasCoordinatedMatches) {
            throw new BadRequestException(
                    "This user has existing donations, requests, or coordinated matches and cannot be deleted. "
                            + "Deactivate the account instead."
            );
        }

        userRepository.delete(user);
    }

    // ---- Donations ----

    @Override
    public List<DonationResponse> listAllDonations() {
        return donationRepository.findAll().stream().map(donationMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void deleteDonation(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        donationRepository.delete(donation);
    }

    // ---- Requests ----

    @Override
    public List<FoodRequestResponse> listAllRequests() {
        return foodRequestRepository.findAll().stream().map(foodRequestMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public void deleteRequest(Long id) {
        FoodRequest foodRequest = foodRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food request not found with id: " + id));
        foodRequestRepository.delete(foodRequest);
    }

    // ---- Contact Messages ----

    @Override
    public List<ContactMessageResponse> listMessages(String statusFilter) {
        List<ContactMessage> messages = (statusFilter != null && !statusFilter.isBlank())
                ? contactMessageRepository.findByStatus(parseContactStatus(statusFilter))
                : contactMessageRepository.findAll();

        return messages.stream().map(contactMessageMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public ContactMessageResponse updateMessageStatus(Long id, StatusUpdateRequest request) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));

        message.setStatus(parseContactStatus(request.status()));
        return contactMessageMapper.toResponse(contactMessageRepository.save(message));
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
        contactMessageRepository.delete(message);
    }

    // ---- Analytics ----

    @Override
    public AnalyticsResponse getAnalytics() {
        return new AnalyticsResponse(
                userRepository.count(),
                userRepository.findByRole(Role.REQUESTER).size(),
                userRepository.findByRole(Role.DONOR).size(),
                userRepository.findByRole(Role.NGO).size(),
                donationRepository.count(),
                foodRequestRepository.count(),
                donationRepository.countByStatus(DonationStatus.COMPLETED),
                // "Active" means not yet completed/expired - AVAILABLE and RESERVED both count,
                // not just AVAILABLE, or a donation mid-match would misleadingly drop out of "active".
                donationRepository.countByStatusIn(List.of(DonationStatus.AVAILABLE, DonationStatus.RESERVED)),
                foodRequestRepository.countByStatus(RequestStatus.OPEN),
                foodRequestRepository.countByStatus(RequestStatus.FULFILLED),
                matchRepository.count(),
                matchRepository.countByStatus(MatchStatus.COMPLETED),
                contactMessageRepository.count(),
                contactMessageRepository.countByStatus(ContactStatus.UNREAD)
        );
    }

    // ---- helpers ----

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private ContactStatus parseContactStatus(String raw) {
        try {
            return ContactStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid message status: " + raw);
        }
    }
}
