package com.socialmedia.modules.post.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostSummaryResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String username;
    private String userProfileImage;
    private Long likeCount;
    private Long commentCount;

    public PostSummaryResponse(Long id, String content, String imageUrl, LocalDateTime createdAt, 
                              String username, String userProfileImage) {
        this.id = id;
        this.content = content;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.username = username;
        this.userProfileImage = userProfileImage;
    }
} 