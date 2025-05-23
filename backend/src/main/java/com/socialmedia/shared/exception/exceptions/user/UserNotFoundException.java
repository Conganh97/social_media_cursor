package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UserNotFoundException extends ResourceNotFoundException {
    
    public UserNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
    
    public UserNotFoundException(Long userId) {
        super(ErrorCode.USER_NOT_FOUND, "User not found with id: " + userId);
    }
    
    public UserNotFoundException(String field, String value) {
        super(ErrorCode.USER_NOT_FOUND, "User not found with " + field + ": " + value);
    }
} 