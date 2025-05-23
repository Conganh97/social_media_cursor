package com.socialmedia.modules.social.exception;

public class FriendshipNotFoundException extends RuntimeException {
    
    public FriendshipNotFoundException(String message) {
        super(message);
    }
    
    public FriendshipNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public FriendshipNotFoundException(Long friendshipId) {
        super("Friendship not found with id: " + friendshipId);
    }
} 