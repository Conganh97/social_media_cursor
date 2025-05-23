package com.socialmedia.modules.user.controller;

import com.socialmedia.modules.user.dto.UserInfoResponse;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.user.dto.UserUpdateRequest;
import com.socialmedia.modules.user.exception.UserAlreadyExistsException;
import com.socialmedia.modules.user.exception.UserNotFoundException;
import com.socialmedia.modules.user.service.UserService;
import com.socialmedia.entity.User;
import com.socialmedia.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            UserInfoResponse userProfile = userService.getUserProfile(userPrincipal.getId());
            return ResponseEntity.ok(userProfile);
        } catch (UserNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            UserInfoResponse updatedProfile = userService.updateUserProfile(userPrincipal.getId(), updateRequest);
            return ResponseEntity.ok(updatedProfile);
        } catch (UserNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (UserAlreadyExistsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserInfoResponse userProfile = userService.getUserProfile(id);
            return ResponseEntity.ok(userProfile);
        } catch (UserNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Search query cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }

            List<User> users = userService.searchUsers(query.trim());
            List<UserSummaryResponse> userSummaries = users.stream()
                    .map(user -> new UserSummaryResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getProfileImageUrl()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userSummaries);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Search failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {
        
        Map<String, String> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("error", "File is empty");
            return ResponseEntity.badRequest().body(response);
        }

        if (!file.getContentType().startsWith("image/")) {
            response.put("error", "File must be an image");
            return ResponseEntity.badRequest().body(response);
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            response.put("error", "File size must be less than 5MB");
            return ResponseEntity.badRequest().body(response);
        }

        String fileName = file.getOriginalFilename();
        String fileUrl = "/uploads/avatars/" + userPrincipal.getId() + "_" + fileName;
        
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setProfileImageUrl(fileUrl);
        
        try {
            userService.updateUserProfile(userPrincipal.getId(), updateRequest);
            response.put("message", "Avatar uploaded successfully");
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Failed to upload avatar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/users-by-ids")
    public ResponseEntity<?> getUsersByIds(@RequestBody List<Long> userIds) {
        try {
            if (userIds == null || userIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User IDs list cannot be empty");
                return ResponseEntity.badRequest().body(error);
            }

            List<UserSummaryResponse> users = userService.getUsersByIds(userIds);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        Map<String, String> response = new HashMap<>();
        
        if (!userPrincipal.getId().equals(id)) {
            response.put("error", "You can only deactivate your own account");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            boolean deactivated = userService.deactivateUser(id);
            if (deactivated) {
                response.put("message", "Account deactivated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Failed to deactivate account");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.put("error", "Failed to deactivate account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 