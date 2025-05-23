package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class InvalidFriendshipStatusException extends BusinessLogicException {
    
    public InvalidFriendshipStatusException(String message) {
        super(ErrorCode.INVALID_FRIENDSHIP_STATUS, message);
    }
    
    public InvalidFriendshipStatusException(String currentStatus, String attemptedStatus) {
        super(ErrorCode.INVALID_FRIENDSHIP_STATUS, 
              "Cannot change friendship status from " + currentStatus + " to " + attemptedStatus);
    }
    
    public static InvalidFriendshipStatusException cannotBefriendSelf() {
        return new InvalidFriendshipStatusException(ErrorCode.CANNOT_BEFRIEND_SELF, 
                                                  "Cannot send friend request to yourself");
    }
    
    public static InvalidFriendshipStatusException duplicateRequest() {
        return new InvalidFriendshipStatusException(ErrorCode.DUPLICATE_FRIEND_REQUEST, 
                                                  "Friend request already exists");
    }
    
    private InvalidFriendshipStatusException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
} 