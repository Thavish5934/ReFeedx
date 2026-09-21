package com.refeedx.exception;

/** Thrown for invalid business input that passed bean validation but still doesn't make sense
 *  (e.g. duplicate email, expiryAt before preparedAt). Maps to 400. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
