package com.refeedx.service;

import com.refeedx.dto.request.MatchRequest;
import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.MatchResponse;
import com.refeedx.entity.enums.Role;

import java.util.List;

public interface MatchService {

    /**
     * Links a Donation to a FoodRequest. If the caller is an NGO, they are
     * recorded as coordinatedBy; if a DONOR or REQUESTER creates it directly,
     * coordinatedBy stays null.
     */
    MatchResponse createMatch(Long userId, Role role, MatchRequest request);

    MatchResponse getMatchById(Long id);

    List<MatchResponse> getMatchesForNgo(Long ngoUserId);

    /** Owning donor, owning requester, coordinating NGO, or Admin may progress/cancel a match. */
    MatchResponse updateStatus(Long userId, Role role, Long matchId, StatusUpdateRequest request);
}
