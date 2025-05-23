package com.socialmedia.modules.post.exception;

public class UnauthorizedPostAccessException extends RuntimeException {
    
    public UnauthorizedPostAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedPostAccessException(Long postId, Long userId) {
        super("User " + userId + " is not authorized to access post " + postId);
    }
    
    public UnauthorizedPostAccessException() {
        super("You are not authorized to perform this action on this post");
    }
} 