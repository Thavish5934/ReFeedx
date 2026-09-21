package com.refeedx.entity;

import com.refeedx.entity.enums.DonationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A surplus-food post created by a DONOR. Deliberately unidirectional
 * (Donation -> User) rather than also holding a collection on User, to keep
 * the entity graph simple - lookups like "all donations for donor X" go
 * through DonationRepository.findByDonorId instead.
 */
@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name", nullable = false, length = 150)
    private String foodName;

    /** e.g. VEG, NON_VEG, BAKERY, GROCERY, OTHER - kept as a plain string for now. */
    @Column(nullable = false, length = 50)
    private String category;

    /** Free-text quantity, e.g. "10 kg" or "30 plates". */
    @Column(nullable = false, length = 50)
    private String quantity;

    /** Approximate number of people this donation can serve. */
    @Column(nullable = false)
    private Integer servings;

    @Column(name = "prepared_at", nullable = false)
    private LocalDateTime preparedAt;

    @Column(name = "expiry_at", nullable = false)
    private LocalDateTime expiryAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    /** Optional precise coordinates, used to build "Get Directions" links. */
    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DonationStatus status = DonationStatus.AVAILABLE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
