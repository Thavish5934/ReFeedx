package com.refeedx.exception;

/** Thrown when an authenticated user tries to act on a resource they don't own or aren't
 *  permitted to touch (e.g. editing someone else's donation). Maps to 403. */
public class AccessDeniedCustomException extends RuntimeException {
    public AccessDeniedCustomException(String message) {
        super(message);
    }
}
