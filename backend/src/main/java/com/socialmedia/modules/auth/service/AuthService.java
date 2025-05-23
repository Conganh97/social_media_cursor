package com.socialmedia.modules.auth.service;

import com.socialmedia.modules.auth.dto.JwtResponse;
import com.socialmedia.modules.auth.dto.LoginRequest;
import com.socialmedia.modules.auth.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    ResponseEntity<?> registerUser(RegisterRequest registerRequest);
    JwtResponse refreshToken(String refreshToken);
    ResponseEntity<?> logoutUser(String token);
    boolean validateToken(String token);
    String extractUsernameFromToken(String token);
    Long extractUserIdFromToken(String token);
} 