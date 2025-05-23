package com.socialmedia.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String profileImageUrl;

    public String getFullName() {
        return firstName + " " + lastName;
    }
} 