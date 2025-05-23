package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class MessageNotFoundException extends ResourceNotFoundException {
    
    public MessageNotFoundException(String message) {
        super(ErrorCode.MESSAGE_NOT_FOUND, message);
    }
    
    public MessageNotFoundException(Long messageId) {
        super(ErrorCode.MESSAGE_NOT_FOUND, "Message not found with id: " + messageId);
    }
    
    public static MessageNotFoundException forConversation(Long userId1, Long userId2) {
        return new MessageNotFoundException(ErrorCode.CONVERSATION_NOT_FOUND, 
                                           "No conversation found between users " + userId1 + " and " + userId2);
    }
    
    private MessageNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
} 