package com.refeedx.scheduler;

import com.refeedx.entity.Donation;
import com.refeedx.entity.enums.DonationStatus;
import com.refeedx.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * The EXPIRED status exists specifically for donations whose expiryAt has
 * passed - without this job, that would only ever happen if a donor, NGO,
 * or Admin manually flipped the status, which defeats the point of having
 * an expiry time at all. Runs every 15 minutes and catches anything still
 * AVAILABLE or RESERVED past its expiry.
 *
 * Deliberately does NOT touch COLLECTED/COMPLETED donations even if their
 * expiryAt has passed - the food was already handed over, so "expired"
 * would be the wrong status for it.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DonationExpiryScheduler {

    private static final List<DonationStatus> EXPIRABLE_STATUSES = List.of(
            DonationStatus.AVAILABLE,
            DonationStatus.RESERVED
    );

    private final DonationRepository donationRepository;

    @Scheduled(fixedRate = 15 * 60 * 1000) // every 15 minutes
    @Transactional
    public void expireOverdueDonations() {
        List<Donation> overdue = donationRepository.findByStatusInAndExpiryAtBefore(
                EXPIRABLE_STATUSES,
                LocalDateTime.now()
        );

        if (overdue.isEmpty()) {
            return;
        }

        overdue.forEach(donation -> donation.setStatus(DonationStatus.EXPIRED));
        donationRepository.saveAll(overdue);

        log.info("[ReFeedX] Auto-expired {} donation(s) past their expiry time.", overdue.size());
    }
}
