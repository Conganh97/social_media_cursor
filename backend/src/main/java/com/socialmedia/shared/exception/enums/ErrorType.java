package com.socialmedia.shared.exception.enums;

public enum ErrorType {
    VALIDATION("Input validation error"),
    BUSINESS("Business logic error"),
    SYSTEM("System error"),
    SECURITY("Security error"),
    AUTHENTICATION("Authentication error"),
    AUTHORIZATION("Authorization error"),
    EXTERNAL_SERVICE("External service error"),
    DATABASE("Database error"),
    FILE_PROCESSING("File processing error"),
    WEBSOCKET("WebSocket error");

    private final String description;

    ErrorType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 