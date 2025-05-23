package com.socialmedia.modules.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    @NotBlank
    @Size(max = 1000, message = "Post content must not exceed 1000 characters")
    private String content;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;
} 