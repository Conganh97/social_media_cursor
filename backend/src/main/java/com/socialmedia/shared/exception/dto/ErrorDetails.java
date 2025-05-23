package com.socialmedia.shared.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    private String source;
    private String description;
    private Map<String, Object> context;
    private String stackTrace;
} 