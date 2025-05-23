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
public class ConversationResponse {
    private UserSummaryResponse conversationPartner;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Boolean hasUnreadMessages;
    private Long unreadCount;
} 