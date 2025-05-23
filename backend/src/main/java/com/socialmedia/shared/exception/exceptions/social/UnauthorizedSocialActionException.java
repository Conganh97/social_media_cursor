package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class UnauthorizedSocialActionException extends AuthorizationException {
    
    public UnauthorizedSocialActionException(String message) {
        super(ErrorCode.RESOURCE_FORBIDDEN, message);
    }
    
    public static UnauthorizedSocialActionException forComment(Long commentId, Long userId) {
        return new UnauthorizedSocialActionException("User " + userId + " is not authorized to modify comment " + commentId);
    }
    
    public static UnauthorizedSocialActionException forFriendship(Long userId1, Long userId2) {
        return new UnauthorizedSocialActionException("User " + userId1 + " is not authorized to manage friendship with user " + userId2);
    }
    
    public static UnauthorizedSocialActionException forLike(Long postId, Long userId) {
        return new UnauthorizedSocialActionException("User " + userId + " is not authorized to like/unlike post " + postId);
    }
} 