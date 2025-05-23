package com.socialmedia.shared.exception.enums;

public enum ErrorCode {
    // Authentication Errors (AUTH_001 - AUTH_099)
    INVALID_CREDENTIALS("AUTH_001", "Invalid username or password", ErrorType.AUTHENTICATION),
    ACCOUNT_LOCKED("AUTH_002", "Account is locked", ErrorType.AUTHENTICATION),
    ACCOUNT_DISABLED("AUTH_003", "Account is disabled", ErrorType.AUTHENTICATION),
    EMAIL_NOT_VERIFIED("AUTH_004", "Email address not verified", ErrorType.AUTHENTICATION),
    INVALID_TOKEN("AUTH_005", "Invalid or expired token", ErrorType.AUTHENTICATION),
    TOKEN_BLACKLISTED("AUTH_006", "Token has been blacklisted", ErrorType.AUTHENTICATION),
    REFRESH_TOKEN_EXPIRED("AUTH_007", "Refresh token has expired", ErrorType.AUTHENTICATION),

    // Authorization Errors (AUTHZ_001 - AUTHZ_099)
    ACCESS_DENIED("AUTHZ_001", "Access denied", ErrorType.AUTHORIZATION),
    INSUFFICIENT_PRIVILEGES("AUTHZ_002", "Insufficient privileges", ErrorType.AUTHORIZATION),
    RESOURCE_FORBIDDEN("AUTHZ_003", "Resource access forbidden", ErrorType.AUTHORIZATION),

    // Validation Errors (VAL_001 - VAL_099)
    VALIDATION_FAILED("VAL_001", "Input validation failed", ErrorType.VALIDATION),
    REQUIRED_FIELD_MISSING("VAL_002", "Required field is missing", ErrorType.VALIDATION),
    INVALID_EMAIL_FORMAT("VAL_003", "Invalid email format", ErrorType.VALIDATION),
    INVALID_PHONE_FORMAT("VAL_004", "Invalid phone number format", ErrorType.VALIDATION),
    PASSWORD_TOO_WEAK("VAL_005", "Password does not meet requirements", ErrorType.VALIDATION),
    INVALID_DATE_RANGE("VAL_006", "Invalid date range", ErrorType.VALIDATION),
    FILE_TOO_LARGE("VAL_007", "File size exceeds maximum allowed", ErrorType.VALIDATION),
    INVALID_FILE_TYPE("VAL_008", "Invalid file type", ErrorType.VALIDATION),

    // Business Logic Errors (BIZ_001 - BIZ_099)
    USER_ALREADY_EXISTS("BIZ_001", "User already exists", ErrorType.BUSINESS),
    EMAIL_ALREADY_REGISTERED("BIZ_002", "Email address already registered", ErrorType.BUSINESS),
    USERNAME_ALREADY_TAKEN("BIZ_003", "Username already taken", ErrorType.BUSINESS),
    DUPLICATE_LIKE("BIZ_004", "User has already liked this post", ErrorType.BUSINESS),
    DUPLICATE_FRIEND_REQUEST("BIZ_005", "Friend request already sent", ErrorType.BUSINESS),
    CANNOT_BEFRIEND_SELF("BIZ_006", "Cannot send friend request to yourself", ErrorType.BUSINESS),
    INVALID_FRIENDSHIP_STATUS("BIZ_007", "Invalid friendship status transition", ErrorType.BUSINESS),
    CANNOT_MESSAGE_SELF("BIZ_008", "Cannot send message to yourself", ErrorType.BUSINESS),
    POST_EDITING_TIME_EXPIRED("BIZ_009", "Post editing time has expired", ErrorType.BUSINESS),
    COMMENT_EDITING_TIME_EXPIRED("BIZ_010", "Comment editing time has expired", ErrorType.BUSINESS),

    // Resource Not Found Errors (NF_001 - NF_099)
    USER_NOT_FOUND("NF_001", "User not found", ErrorType.BUSINESS),
    POST_NOT_FOUND("NF_002", "Post not found", ErrorType.BUSINESS),
    COMMENT_NOT_FOUND("NF_003", "Comment not found", ErrorType.BUSINESS),
    MESSAGE_NOT_FOUND("NF_004", "Message not found", ErrorType.BUSINESS),
    NOTIFICATION_NOT_FOUND("NF_005", "Notification not found", ErrorType.BUSINESS),
    FRIENDSHIP_NOT_FOUND("NF_006", "Friendship not found", ErrorType.BUSINESS),
    FILE_NOT_FOUND("NF_007", "File not found", ErrorType.BUSINESS),
    CONVERSATION_NOT_FOUND("NF_008", "Conversation not found", ErrorType.BUSINESS),

    // Database Errors (DB_001 - DB_099)
    DATABASE_CONNECTION_ERROR("DB_001", "Database connection error", ErrorType.DATABASE),
    CONSTRAINT_VIOLATION("DB_002", "Database constraint violation", ErrorType.DATABASE),
    DATA_INTEGRITY_ERROR("DB_003", "Data integrity error", ErrorType.DATABASE),
    TRANSACTION_ROLLBACK("DB_004", "Transaction rolled back", ErrorType.DATABASE),
    QUERY_TIMEOUT("DB_005", "Database query timeout", ErrorType.DATABASE),

    // File Processing Errors (FILE_001 - FILE_099)
    FILE_UPLOAD_FAILED("FILE_001", "File upload failed", ErrorType.FILE_PROCESSING),
    FILE_PROCESSING_ERROR("FILE_002", "File processing error", ErrorType.FILE_PROCESSING),
    INVALID_IMAGE_FORMAT("FILE_003", "Invalid image format", ErrorType.FILE_PROCESSING),
    IMAGE_PROCESSING_FAILED("FILE_004", "Image processing failed", ErrorType.FILE_PROCESSING),
    FILE_STORAGE_ERROR("FILE_005", "File storage error", ErrorType.FILE_PROCESSING),
    FILE_DELETION_FAILED("FILE_006", "File deletion failed", ErrorType.FILE_PROCESSING),

    // System Errors (SYS_001 - SYS_099)
    INTERNAL_SERVER_ERROR("SYS_001", "Internal server error", ErrorType.SYSTEM),
    SERVICE_UNAVAILABLE("SYS_002", "Service temporarily unavailable", ErrorType.SYSTEM),
    CONFIGURATION_ERROR("SYS_003", "System configuration error", ErrorType.SYSTEM),
    EXTERNAL_API_ERROR("SYS_004", "External API error", ErrorType.EXTERNAL_SERVICE),
    RATE_LIMIT_EXCEEDED("SYS_005", "Rate limit exceeded", ErrorType.SYSTEM),

    // WebSocket Errors (WS_001 - WS_099)
    WEBSOCKET_CONNECTION_FAILED("WS_001", "WebSocket connection failed", ErrorType.WEBSOCKET),
    WEBSOCKET_MESSAGE_FAILED("WS_002", "WebSocket message delivery failed", ErrorType.WEBSOCKET),
    WEBSOCKET_UNAUTHORIZED("WS_003", "WebSocket connection unauthorized", ErrorType.WEBSOCKET);

    private final String code;
    private final String message;
    private final ErrorType type;

    ErrorCode(String code, String message, ErrorType type) {
        this.code = code;
        this.message = message;
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public ErrorType getType() {
        return type;
    }
} 