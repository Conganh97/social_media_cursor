package com.socialmedia.modules.social.exception;

public class CommentNotFoundException extends RuntimeException {
    
    public CommentNotFoundException(String message) {
        super(message);
    }
    
    public CommentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public CommentNotFoundException(Long commentId) {
        super("Comment not found with id: " + commentId);
    }
} 