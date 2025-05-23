package com.socialmedia.shared.exception.dto;

import com.socialmedia.shared.exception.enums.ErrorCode;
import com.socialmedia.shared.exception.enums.ErrorType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ValidationErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String correlationId;
    private ErrorCode errorCode;
    private ErrorType errorType;
    private List<FieldError> fieldErrors;
    private ErrorDetails details;

    public ValidationErrorResponse(int status, String error, String message, String path, 
                                 String correlationId, ErrorCode errorCode) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.correlationId = correlationId;
        this.errorCode = errorCode;
        this.errorType = errorCode.getType();
        this.fieldErrors = new ArrayList<>();
    }

    public void addFieldError(String field, Object rejectedValue, String message, String code) {
        if (fieldErrors == null) {
            fieldErrors = new ArrayList<>();
        }
        fieldErrors.add(new FieldError(field, rejectedValue, message, code));
    }

    public void addFieldError(FieldError fieldError) {
        if (fieldErrors == null) {
            fieldErrors = new ArrayList<>();
        }
        fieldErrors.add(fieldError);
    }
} 