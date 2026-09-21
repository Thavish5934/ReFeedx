package com.refeedx.repository;

import com.refeedx.entity.Match;
import com.refeedx.entity.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByDonationId(Long donationId);

    List<Match> findByFoodRequestId(Long requestId);

    List<Match> findByCoordinatedById(Long ngoUserId);

    long countByStatus(MatchStatus status);
}
