package com.socialmedia.modules.post.dto;

import com.socialmedia.modules.user.dto.UserSummaryResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSummaryResponse user;
    private Long likeCount;
    private Long commentCount;
    private Boolean isLikedByCurrentUser;

    public PostResponse(Long id, String content, String imageUrl, LocalDateTime createdAt, 
                       LocalDateTime updatedAt, UserSummaryResponse user) {
        this.id = id;
        this.content = content;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
    }
} 