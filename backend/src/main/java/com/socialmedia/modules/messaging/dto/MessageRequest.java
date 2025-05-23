package com.socialmedia.modules.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank
    @Size(max = 1000, message = "Message content must not exceed 1000 characters")
    private String content;
} 