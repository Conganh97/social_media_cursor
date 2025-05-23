package com.socialmedia.modules.post.exception;

public class PostNotFoundException extends RuntimeException {
    
    public PostNotFoundException(String message) {
        super(message);
    }
    
    public PostNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PostNotFoundException(Long postId) {
        super("Post not found with id: " + postId);
    }
} 