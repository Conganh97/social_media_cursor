package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UserAlreadyExistsException extends BusinessLogicException {
    
    public UserAlreadyExistsException(String message) {
        super(ErrorCode.USER_ALREADY_EXISTS, message);
    }
    
    public UserAlreadyExistsException(String field, String value) {
        super(ErrorCode.USER_ALREADY_EXISTS, "User already exists with " + field + ": " + value);
    }
    
    public static UserAlreadyExistsException withEmail(String email) {
        return new UserAlreadyExistsException(ErrorCode.EMAIL_ALREADY_REGISTERED, "Email already registered: " + email);
    }
    
    public static UserAlreadyExistsException withUsername(String username) {
        return new UserAlreadyExistsException(ErrorCode.USERNAME_ALREADY_TAKEN, "Username already taken: " + username);
    }
    
    private UserAlreadyExistsException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
} 