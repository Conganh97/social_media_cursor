package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class ExternalServiceException extends BaseException {
    
    public ExternalServiceException(ErrorCode errorCode) {
        super(errorCode);
    }

    public ExternalServiceException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    public ExternalServiceException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public ExternalServiceException(ErrorCode errorCode, String customMessage, Throwable cause) {
        super(errorCode, customMessage, cause);
    }

    public ExternalServiceException(ErrorCode errorCode, Object[] messageArgs) {
        super(errorCode, messageArgs);
    }
} 