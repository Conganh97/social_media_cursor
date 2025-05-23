package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UnauthorizedMessageAccessException extends AuthorizationException {
    
    public UnauthorizedMessageAccessException(String message) {
        super(ErrorCode.RESOURCE_FORBIDDEN, message);
    }
    
    public UnauthorizedMessageAccessException(Long messageId, Long userId) {
        super(ErrorCode.RESOURCE_FORBIDDEN, "User " + userId + " is not authorized to access message " + messageId);
    }
    
    public static UnauthorizedMessageAccessException forConversation(Long userId1, Long userId2) {
        return new UnauthorizedMessageAccessException("User " + userId1 + " is not authorized to access conversation with user " + userId2);
    }
} 