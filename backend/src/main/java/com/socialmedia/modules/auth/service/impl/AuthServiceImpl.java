package com.socialmedia.modules.auth.service.impl;

import com.socialmedia.modules.auth.dto.JwtResponse;
import com.socialmedia.modules.auth.dto.LoginRequest;
import com.socialmedia.modules.auth.dto.RegisterRequest;
import com.socialmedia.modules.auth.service.AuthService;
import com.socialmedia.modules.user.service.UserService;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.security.JwtTokenProvider;
import com.socialmedia.shared.exception.enums.ErrorCode;
import com.socialmedia.shared.exception.exceptions.AuthenticationException;
import com.socialmedia.shared.exception.exceptions.BusinessLogicException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private Set<String> blacklistedTokens = new HashSet<>();

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            User user;
            if (loginRequest.getUsernameOrEmail().contains("@")) {
                user = userService.getUserByEmail(loginRequest.getUsernameOrEmail());
            } else {
                user = userService.getUserByUsername(loginRequest.getUsernameOrEmail());
            }

            logger.info("User {} authenticated successfully", user.getUsername());
            return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), refreshToken);

        } catch (org.springframework.security.core.AuthenticationException e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsernameOrEmail());
            throw new AuthenticationException(ErrorCode.INVALID_CREDENTIALS, "Invalid username or password");
        }
    }

    @Override
    public ResponseEntity<?> registerUser(RegisterRequest registerRequest) {
        try {
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body("Error: Username is already taken!");
            }

            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body("Error: Email is already in use!");
            }

            User user = userService.registerUser(registerRequest);
            logger.info("User {} registered successfully", user.getUsername());
            
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            return ResponseEntity.badRequest()
                    .body("Error: Registration failed - " + e.getMessage());
        }
    }

    @Override
    public JwtResponse refreshToken(String refreshToken) {
        try {
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                throw new AuthenticationException(ErrorCode.INVALID_TOKEN, "Invalid refresh token");
            }

            if (blacklistedTokens.contains(refreshToken)) {
                throw new AuthenticationException(ErrorCode.TOKEN_BLACKLISTED, "Refresh token has been revoked");
            }

            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            User user = userService.getUserByUsername(username);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username, null, null
            );

            String newAccessToken = jwtTokenProvider.generateToken(authentication);
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            blacklistedTokens.add(refreshToken);

            logger.info("Token refreshed for user: {}", username);
            return new JwtResponse(newAccessToken, user.getId(), user.getUsername(), 
                                 user.getEmail(), newRefreshToken);

        } catch (AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            throw new BusinessLogicException(ErrorCode.INTERNAL_SERVER_ERROR, "Token refresh failed");
        }
    }

    @Override
    public ResponseEntity<?> logoutUser(String token) {
        try {
            if (validateToken(token)) {
                blacklistedTokens.add(token);
                String username = extractUsernameFromToken(token);
                logger.info("User {} logged out successfully", username);
                return ResponseEntity.ok("User logged out successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid token");
            }
        } catch (Exception e) {
            logger.error("Logout failed", e);
            return ResponseEntity.badRequest().body("Logout failed");
        }
    }

    @Override
    public boolean validateToken(String token) {
        try {
            if (blacklistedTokens.contains(token)) {
                return false;
            }
            return jwtTokenProvider.validateToken(token);
        } catch (Exception e) {
            logger.error("Token validation failed", e);
            return false;
        }
    }

    @Override
    public String extractUsernameFromToken(String token) {
        try {
            return jwtTokenProvider.getUsernameFromToken(token);
        } catch (Exception e) {
            logger.error("Failed to extract username from token", e);
            return null;
        }
    }

    @Override
    public Long extractUserIdFromToken(String token) {
        try {
            return jwtTokenProvider.getUserIdFromToken(token);
        } catch (Exception e) {
            logger.error("Failed to extract user ID from token", e);
            return null;
        }
    }
} 