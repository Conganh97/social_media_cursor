package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class FileStorageException extends ExternalServiceException {
    
    public FileStorageException(String message) {
        super(ErrorCode.FILE_STORAGE_ERROR, message);
    }
    
    public FileStorageException(String message, Throwable cause) {
        super(ErrorCode.FILE_STORAGE_ERROR, message, cause);
    }
    
    public static FileStorageException uploadFailed(String filename) {
        return new FileStorageException("Failed to upload file: " + filename);
    }
    
    public static FileStorageException deleteFailed(String filename) {
        return new FileStorageException(ErrorCode.FILE_DELETION_FAILED, "Failed to delete file: " + filename);
    }
    
    private FileStorageException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
} 