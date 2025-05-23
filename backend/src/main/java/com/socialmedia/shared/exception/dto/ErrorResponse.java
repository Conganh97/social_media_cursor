package com.socialmedia.shared.exception.dto;

import com.socialmedia.shared.exception.enums.ErrorCode;
import com.socialmedia.shared.exception.enums.ErrorType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String correlationId;
    private ErrorCode errorCode;
    private ErrorType errorType;
    private ErrorDetails details;

    public ErrorResponse(int status, String error, String message, String path, 
                        String correlationId, ErrorCode errorCode) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.correlationId = correlationId;
        this.errorCode = errorCode;
        this.errorType = errorCode.getType();
    }

    public ErrorResponse(int status, String error, String message, String path, 
                        String correlationId, ErrorCode errorCode, ErrorDetails details) {
        this(status, error, message, path, correlationId, errorCode);
        this.details = details;
    }

    public static ErrorResponse of(int status, String error, String message, String path, 
                                 String correlationId, ErrorCode errorCode) {
        return new ErrorResponse(status, error, message, path, correlationId, errorCode);
    }

    public static ErrorResponse withDetails(int status, String error, String message, String path, 
                                          String correlationId, ErrorCode errorCode, 
                                          ErrorDetails details) {
        return new ErrorResponse(status, error, message, path, correlationId, errorCode, details);
    }
} 