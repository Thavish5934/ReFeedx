package com.refeedx.repository;

import com.refeedx.entity.FoodRequest;
import com.refeedx.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRequestRepository extends JpaRepository<FoodRequest, Long> {

    List<FoodRequest> findByRequesterId(Long requesterId);

    List<FoodRequest> findByStatus(RequestStatus status);

    long countByStatus(RequestStatus status);
}
