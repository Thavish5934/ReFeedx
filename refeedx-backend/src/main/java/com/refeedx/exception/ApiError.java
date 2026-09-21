package com.refeedx.exception;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Uniform error body returned by GlobalExceptionHandler for every failure
 * case, so the frontend can always parse the same shape regardless of which
 * exception was thrown.
 */
public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        List<String> details
) {
    public ApiError(int status, String error, String message) {
        this(LocalDateTime.now(), status, error, message, null);
    }

    public ApiError(int status, String error, String message, List<String> details) {
        this(LocalDateTime.now(), status, error, message, details);
    }
}
