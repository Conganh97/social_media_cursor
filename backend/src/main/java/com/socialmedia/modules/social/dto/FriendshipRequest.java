package com.socialmedia.modules.social.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipRequest {
    @NotNull(message = "Addressee ID is required")
    private Long addresseeId;
} 