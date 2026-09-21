package com.refeedx.dto.response;

/** Backing data for the Admin Dashboard's stat cards and charts. */
public record AnalyticsResponse(
        long totalUsers,
        long totalRequesters,
        long totalDonors,
        long totalNgos,
        long totalDonations,
        long totalFoodRequests,
        long completedDonations,
        long activeDonations,
        long pendingRequests,
        long fulfilledRequests,
        long totalMatches,
        long completedMatches,
        long totalContactMessages,
        long unreadContactMessages
) {}
