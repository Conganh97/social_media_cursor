package com.socialmedia.modules.social.exception;

public class InvalidFriendshipStatusException extends RuntimeException {
    
    public InvalidFriendshipStatusException(String message) {
        super(message);
    }
    
    public InvalidFriendshipStatusException(String currentStatus, String action) {
        super("Cannot perform action '" + action + "' on friendship with status: " + currentStatus);
    }
    
    public InvalidFriendshipStatusException() {
        super("Invalid friendship status for this operation");
    }
} 