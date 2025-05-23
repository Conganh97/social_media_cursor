package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class PostNotFoundException extends ResourceNotFoundException {
    
    public PostNotFoundException(String message) {
        super(ErrorCode.POST_NOT_FOUND, message);
    }
    
    public PostNotFoundException(Long postId) {
        super(ErrorCode.POST_NOT_FOUND, "Post not found with id: " + postId);
    }
} 