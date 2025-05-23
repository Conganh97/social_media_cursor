package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class FriendshipNotFoundException extends ResourceNotFoundException {
    
    public FriendshipNotFoundException(String message) {
        super(ErrorCode.FRIENDSHIP_NOT_FOUND, message);
    }
    
    public FriendshipNotFoundException(Long userId1, Long userId2) {
        super(ErrorCode.FRIENDSHIP_NOT_FOUND, "Friendship not found between users " + userId1 + " and " + userId2);
    }
    
    public FriendshipNotFoundException(Long friendshipId) {
        super(ErrorCode.FRIENDSHIP_NOT_FOUND, "Friendship not found with id: " + friendshipId);
    }
} 