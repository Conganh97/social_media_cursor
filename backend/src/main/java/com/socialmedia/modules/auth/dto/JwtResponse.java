package com.socialmedia.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private String refreshToken;

    public JwtResponse(String token, Long userId, String username, String email) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
    }

    public JwtResponse(String token, Long userId, String username, String email, String refreshToken) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.refreshToken = refreshToken;
    }
} 