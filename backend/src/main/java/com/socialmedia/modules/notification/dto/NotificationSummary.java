package com.socialmedia.modules.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSummary {
    private Long totalUnread;
    private Long likeNotifications;
    private Long commentNotifications;
    private Long friendRequestNotifications;
    private Long messageNotifications;
    private Long mentionNotifications;
} 