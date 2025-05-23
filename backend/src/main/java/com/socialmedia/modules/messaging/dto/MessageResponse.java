package com.socialmedia.modules.messaging.dto;

import com.socialmedia.modules.user.dto.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private String content;
    private Boolean readStatus;
    private LocalDateTime createdAt;
    private UserSummaryResponse sender;
    private UserSummaryResponse receiver;
} 