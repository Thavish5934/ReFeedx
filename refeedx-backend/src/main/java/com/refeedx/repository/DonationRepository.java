package com.refeedx.repository;

import com.refeedx.entity.Donation;
import com.refeedx.entity.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorId(Long donorId);

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByCategory(String category);

    long countByStatus(DonationStatus status);

    /** Used for the "active donations" analytics figure - AVAILABLE and RESERVED together. */
    long countByStatusIn(Collection<DonationStatus> statuses);

    /** Used by the scheduled expiry job to find donations whose expiry has passed but haven't been marked EXPIRED yet. */
    List<Donation> findByStatusInAndExpiryAtBefore(Collection<DonationStatus> statuses, LocalDateTime cutoff);
}
