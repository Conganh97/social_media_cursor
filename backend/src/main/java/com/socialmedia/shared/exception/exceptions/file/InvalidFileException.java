package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class InvalidFileException extends ValidationException {
    
    public InvalidFileException(String message) {
        super(ErrorCode.INVALID_FILE_TYPE, message);
    }
    
    public InvalidFileException(String message, Throwable cause) {
        super(ErrorCode.INVALID_FILE_TYPE, message, cause);
    }
    
    public static InvalidFileException invalidType(String filename, String allowedTypes) {
        return new InvalidFileException("Invalid file type for " + filename + ". Allowed types: " + allowedTypes);
    }
    
    public static InvalidFileException tooLarge(String filename, long maxSize) {
        return new InvalidFileException(ErrorCode.FILE_TOO_LARGE, "File " + filename + " exceeds maximum size of " + maxSize + " bytes");
    }
    
    public static InvalidFileException invalidImageFormat(String filename) {
        return new InvalidFileException(ErrorCode.INVALID_IMAGE_FORMAT, "Invalid image format for file: " + filename);
    }
    
    private InvalidFileException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
} 