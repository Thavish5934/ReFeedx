package com.refeedx.exception;

/** Thrown when a requested entity (user, donation, request, etc.) doesn't exist. Maps to 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
