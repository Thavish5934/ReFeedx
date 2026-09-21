package com.refeedx.mapper;

import com.refeedx.dto.response.MatchResponse;
import com.refeedx.entity.Match;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MatchMapper {

    private final UserMapper userMapper;
    private final DonationMapper donationMapper;
    private final FoodRequestMapper foodRequestMapper;

    public MatchResponse toResponse(Match match) {
        if (match == null) return null;

        return new MatchResponse(
                match.getId(),
                donationMapper.toResponse(match.getDonation()),
                foodRequestMapper.toResponse(match.getFoodRequest()),
                userMapper.toSummary(match.getCoordinatedBy()),
                match.getStatus(),
                match.getCreatedAt(),
                match.getUpdatedAt()
        );
    }
}
