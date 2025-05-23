package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class AuthorizationException extends BaseException {
    
    public AuthorizationException(ErrorCode errorCode) {
        super(errorCode);
    }

    public AuthorizationException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    public AuthorizationException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public AuthorizationException(ErrorCode errorCode, String customMessage, Throwable cause) {
        super(errorCode, customMessage, cause);
    }

    public AuthorizationException(ErrorCode errorCode, Object[] messageArgs) {
        super(errorCode, messageArgs);
    }
} 