package com.socialmedia.shared.exception;

import com.socialmedia.shared.exception.dto.ErrorDetails;
import com.socialmedia.shared.exception.dto.ErrorResponse;
import com.socialmedia.shared.exception.dto.FieldError;
import com.socialmedia.shared.exception.dto.ValidationErrorResponse;
import com.socialmedia.shared.exception.enums.ErrorCode;
import com.socialmedia.shared.exception.exceptions.*;
import com.socialmedia.shared.exception.util.CorrelationIdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.validation.ConstraintViolationException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final CorrelationIdGenerator correlationIdGenerator;

    @Value("${app.exception.include-stack-trace:false}")
    private boolean includeStackTrace;

    @Value("${app.exception.include-error-details:true}")
    private boolean includeErrorDetails;

    // Custom Base Exception Handler
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        HttpStatus status = getHttpStatusForException(ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                path,
                correlationId,
                ex.getErrorCode()
        );

        if (includeErrorDetails) {
            errorResponse.setDetails(createErrorDetails(ex, "Custom Exception"));
        }

        logError(correlationId, ex, "Custom exception occurred");
        
        return new ResponseEntity<>(errorResponse, status);
    }

    // Validation Exception Handlers
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "Input validation failed for one or more fields",
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        ex.getBindingResult().getFieldErrors().forEach(error -> 
                errorResponse.addFieldError(
                        error.getField(),
                        error.getRejectedValue(),
                        error.getDefaultMessage(),
                        error.getCode()
                )
        );

        if (includeErrorDetails) {
            errorResponse.setDetails(createErrorDetails(ex, "Validation Error"));
        }

        logWarn(correlationId, ex, "Validation failed: {} field errors", ex.getBindingResult().getFieldErrorCount());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ValidationErrorResponse> handleBindException(BindException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Binding Failed",
                "Data binding failed for request parameters",
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        ex.getBindingResult().getFieldErrors().forEach(error -> 
                errorResponse.addFieldError(
                        error.getField(),
                        error.getRejectedValue(),
                        error.getDefaultMessage(),
                        error.getCode()
                )
        );

        logWarn(correlationId, ex, "Binding failed: {} field errors", ex.getBindingResult().getFieldErrorCount());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Constraint Violation",
                "Constraint validation failed",
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            errorResponse.addFieldError(
                    fieldName,
                    violation.getInvalidValue(),
                    violation.getMessage(),
                    "ConstraintViolation"
            );
        });

        logWarn(correlationId, ex, "Constraint violation: {} violations", ex.getConstraintViolations().size());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Security Exception Handlers
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "Authentication Failed",
                "Invalid credentials provided",
                path,
                correlationId,
                ErrorCode.INVALID_CREDENTIALS
        );

        logWarn(correlationId, ex, "Authentication failed: Invalid credentials");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.FORBIDDEN.value(),
                "Access Denied",
                "Access to this resource is denied",
                path,
                correlationId,
                ErrorCode.ACCESS_DENIED
        );

        logWarn(correlationId, ex, "Access denied to resource: {}", path);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorCode errorCode = ErrorCode.INVALID_CREDENTIALS;
        String message = "Authentication failed";
        
        if (ex instanceof LockedException) {
            errorCode = ErrorCode.ACCOUNT_LOCKED;
            message = "Account is locked";
        } else if (ex instanceof DisabledException) {
            errorCode = ErrorCode.ACCOUNT_DISABLED;
            message = "Account is disabled";
        }
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.UNAUTHORIZED.value(),
                "Authentication Failed",
                message,
                path,
                correlationId,
                errorCode
        );

        logWarn(correlationId, ex, "Authentication exception: {}", ex.getClass().getSimpleName());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    // Database Exception Handlers
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.CONFLICT.value(),
                "Data Integrity Violation",
                "Data integrity constraint violation",
                path,
                correlationId,
                ErrorCode.CONSTRAINT_VIOLATION
        );

        if (includeErrorDetails) {
            errorResponse.setDetails(createErrorDetails(ex, "Database Constraint Violation"));
        }

        logError(correlationId, ex, "Data integrity violation occurred");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponse> handleSQLException(SQLException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Database Error",
                "Database operation failed",
                path,
                correlationId,
                ErrorCode.DATABASE_CONNECTION_ERROR
        );

        if (includeErrorDetails) {
            Map<String, Object> context = new HashMap<>();
            context.put("sqlState", ex.getSQLState());
            context.put("errorCode", ex.getErrorCode());
            errorResponse.setDetails(createErrorDetails(ex, "SQL Exception", context));
        }

        logError(correlationId, ex, "SQL exception occurred: SQLState={}, ErrorCode={}", ex.getSQLState(), ex.getErrorCode());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // File Upload Exception Handlers
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(
            MaxUploadSizeExceededException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "File Too Large",
                "File size exceeds maximum allowed size",
                path,
                correlationId,
                ErrorCode.FILE_TOO_LARGE
        );

        logWarn(correlationId, ex, "File upload failed: File size exceeds maximum allowed");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    // HTTP Exception Handlers
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.METHOD_NOT_ALLOWED.value(),
                "Method Not Allowed",
                String.format("HTTP method '%s' is not supported for this endpoint", ex.getMethod()),
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        logWarn(correlationId, ex, "Unsupported HTTP method: {} for path: {}", ex.getMethod(), path);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                String.format("No handler found for %s %s", ex.getHttpMethod(), ex.getRequestURL()),
                path,
                correlationId,
                ErrorCode.USER_NOT_FOUND
        );

        logWarn(correlationId, ex, "No handler found for: {} {}", ex.getHttpMethod(), ex.getRequestURL());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Malformed JSON",
                "Request body is not readable or malformed",
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        logWarn(correlationId, ex, "Malformed request body");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Type Mismatch",
                String.format("Parameter '%s' should be of type '%s'", ex.getName(), ex.getRequiredType().getSimpleName()),
                path,
                correlationId,
                ErrorCode.VALIDATION_FAILED
        );

        logWarn(correlationId, ex, "Type mismatch for parameter: {}", ex.getName());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "Missing Parameter",
                String.format("Required parameter '%s' is missing", ex.getParameterName()),
                path,
                correlationId,
                ErrorCode.REQUIRED_FIELD_MISSING
        );

        logWarn(correlationId, ex, "Missing required parameter: {}", ex.getParameterName());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Generic Exception Handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        String correlationId = correlationIdGenerator.getCorrelationId();
        String path = getPath(request);
        
        ErrorResponse errorResponse = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "An unexpected error occurred",
                path,
                correlationId,
                ErrorCode.INTERNAL_SERVER_ERROR
        );

        if (includeErrorDetails) {
            errorResponse.setDetails(createErrorDetails(ex, "Unexpected Exception"));
        }

        logError(correlationId, ex, "Unexpected exception occurred");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Helper Methods
    private HttpStatus getHttpStatusForException(BaseException ex) {
        switch (ex.getErrorCode().getType()) {
            case VALIDATION:
                return HttpStatus.BAD_REQUEST;
            case AUTHENTICATION:
                return HttpStatus.UNAUTHORIZED;
            case AUTHORIZATION:
                return HttpStatus.FORBIDDEN;
            case BUSINESS:
                if (ex instanceof ResourceNotFoundException) {
                    return HttpStatus.NOT_FOUND;
                }
                return HttpStatus.CONFLICT;
            case DATABASE:
                return HttpStatus.INTERNAL_SERVER_ERROR;
            case FILE_PROCESSING:
                return HttpStatus.BAD_REQUEST;
            case EXTERNAL_SERVICE:
                return HttpStatus.BAD_GATEWAY;
            case WEBSOCKET:
                return HttpStatus.BAD_REQUEST;
            case SYSTEM:
            default:
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    private ErrorDetails createErrorDetails(Exception ex, String source) {
        return createErrorDetails(ex, source, null);
    }

    private ErrorDetails createErrorDetails(Exception ex, String source, Map<String, Object> additionalContext) {
        Map<String, Object> context = new HashMap<>();
        context.put("exceptionType", ex.getClass().getSimpleName());
        context.put("timestamp", System.currentTimeMillis());
        
        if (additionalContext != null) {
            context.putAll(additionalContext);
        }

        String stackTrace = null;
        if (includeStackTrace) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            ex.printStackTrace(pw);
            stackTrace = sw.toString();
        }

        return new ErrorDetails(source, ex.getMessage(), context, stackTrace);
    }

    private String getPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

    private void logError(String correlationId, Exception ex, String message, Object... args) {
        log.error("[{}] " + message, correlationId, args, ex);
    }

    private void logWarn(String correlationId, Exception ex, String message, Object... args) {
        log.warn("[{}] " + message, correlationId, args, ex);
    }
} 