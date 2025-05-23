package com.socialmedia.modules.social.dto;

import com.socialmedia.modules.user.dto.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponse {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
    private UserSummaryResponse requester;
    private UserSummaryResponse addressee;
} 