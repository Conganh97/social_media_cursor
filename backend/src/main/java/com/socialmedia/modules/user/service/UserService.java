package com.socialmedia.modules.user.service;

import com.socialmedia.modules.auth.dto.RegisterRequest;
import com.socialmedia.modules.user.dto.UserInfoResponse;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.user.dto.UserUpdateRequest;
import com.socialmedia.modules.user.entity.User;

import java.util.List;

public interface UserService {
    User registerUser(RegisterRequest registerRequest);
    User getUserById(Long userId);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    UserInfoResponse getUserProfile(Long userId);
    UserInfoResponse updateUserProfile(Long userId, UserUpdateRequest updateRequest);
    List<User> searchUsers(String query);
    List<UserSummaryResponse> getUsersByIds(List<Long> ids);
    boolean deactivateUser(Long userId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 