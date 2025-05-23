package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class DatabaseException extends BaseException {
    
    public DatabaseException(ErrorCode errorCode) {
        super(errorCode);
    }

    public DatabaseException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    public DatabaseException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public DatabaseException(ErrorCode errorCode, String customMessage, Throwable cause) {
        super(errorCode, customMessage, cause);
    }

    public DatabaseException(ErrorCode errorCode, Object[] messageArgs) {
        super(errorCode, messageArgs);
    }
} 