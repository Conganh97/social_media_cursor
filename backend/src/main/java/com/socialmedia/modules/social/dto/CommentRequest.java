package com.socialmedia.modules.social.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    @NotBlank
    @Size(max = 500, message = "Comment content must not exceed 500 characters")
    private String content;

    private Long postId;
} 