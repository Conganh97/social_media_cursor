package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UnauthorizedPostAccessException extends AuthorizationException {
    
    public UnauthorizedPostAccessException(String message) {
        super(ErrorCode.RESOURCE_FORBIDDEN, message);
    }
    
    public UnauthorizedPostAccessException(Long postId, Long userId) {
        super(ErrorCode.RESOURCE_FORBIDDEN, "User " + userId + " is not authorized to access post " + postId);
    }
    
    public static UnauthorizedPostAccessException forEdit(Long postId, Long userId) {
        return new UnauthorizedPostAccessException("User " + userId + " is not authorized to edit post " + postId);
    }
    
    public static UnauthorizedPostAccessException forDelete(Long postId, Long userId) {
        return new UnauthorizedPostAccessException("User " + userId + " is not authorized to delete post " + postId);
    }
} 