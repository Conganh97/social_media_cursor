package com.socialmedia.modules.notification.dto;

import com.socialmedia.modules.user.dto.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;
    private String content;
    private Long relatedId;
    private Boolean readStatus;
    private LocalDateTime createdAt;
    private UserSummaryResponse relatedUser;
} 