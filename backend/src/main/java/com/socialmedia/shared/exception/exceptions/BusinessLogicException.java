package com.socialmedia.shared.exception.exceptions;

import com.socialmedia.shared.exception.enums.ErrorCode;

public class BusinessLogicException extends BaseException {
    
    public BusinessLogicException(ErrorCode errorCode) {
        super(errorCode);
    }

    public BusinessLogicException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    public BusinessLogicException(ErrorCode errorCode, Throwable cause) {
        super(errorCode, cause);
    }

    public BusinessLogicException(ErrorCode errorCode, String customMessage, Throwable cause) {
        super(errorCode, customMessage, cause);
    }

    public BusinessLogicException(ErrorCode errorCode, Object[] messageArgs) {
        super(errorCode, messageArgs);
    }
} 