package com.socialmedia.shared.exception.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CorrelationIdGenerator {
    
    private static final ThreadLocal<String> correlationIdHolder = new ThreadLocal<>();
    
    public String generate() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
    
    public void setCorrelationId(String correlationId) {
        correlationIdHolder.set(correlationId);
    }
    
    public String getCorrelationId() {
        String correlationId = correlationIdHolder.get();
        if (correlationId == null) {
            correlationId = generate();
            setCorrelationId(correlationId);
        }
        return correlationId;
    }
    
    public void clearCorrelationId() {
        correlationIdHolder.remove();
    }
} 