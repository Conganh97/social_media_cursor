package com.socialmedia.modules.user.controller;

import com.socialmedia.modules.user.dto.UserInfoResponse;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.user.dto.UserUpdateRequest;
import com.socialmedia.modules.user.service.UserService;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.security.UserPrincipal;
import com.socialmedia.shared.exception.exceptions.ValidationException;
import com.socialmedia.shared.exception.enums.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
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
@Tag(name = "User Management", description = "User profile management and user-related operations")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(
            summary = "Get Current User Profile",
            description = "Get the authenticated user's profile information including personal details and account status."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfoResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "id": 1,
                                              "username": "john_doe",
                                              "email": "john@example.com",
                                              "firstName": "John",
                                              "lastName": "Doe",
                                              "bio": "Software developer passionate about technology",
                                              "location": "New York, USA",
                                              "websiteUrl": "https://johndoe.dev",
                                              "profileImageUrl": "/uploads/avatars/1_profile.jpg",
                                              "coverImageUrl": "/uploads/covers/1_cover.jpg",
                                              "isPrivate": false,
                                              "createdAt": "2024-01-01T12:00:00Z",
                                              "lastActiveAt": "2024-01-15T10:30:00Z"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserInfoResponse userProfile = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(userProfile);
    }

    @Operation(
            summary = "Update Current User Profile",
            description = "Update the authenticated user's profile information. All fields are optional.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User profile update data",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserUpdateRequest.class),
                            examples = @ExampleObject(
                                    name = "Profile Update Example",
                                    value = """
                                            {
                                              "firstName": "John",
                                              "lastName": "Smith",
                                              "bio": "Updated bio: Full-stack developer",
                                              "location": "San Francisco, CA",
                                              "websiteUrl": "https://johnsmith.dev",
                                              "isPrivate": true
                                            }"""
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfoResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Username or email already exists",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PutMapping("/me")
    public ResponseEntity<UserInfoResponse> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        UserInfoResponse updatedProfile = userService.updateUserProfile(userPrincipal.getId(), updateRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @Operation(
            summary = "Get User Profile by ID",
            description = "Get public profile information for any user by their ID.",
            parameters = @Parameter(
                    name = "id",
                    description = "User ID",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserInfoResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "timestamp": "2024-01-01T12:00:00Z",
                                              "status": 404,
                                              "error": "Not Found",
                                              "message": "User not found with id: 999"
                                            }"""
                            )
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserInfoResponse> getUserById(@PathVariable Long id) {
        UserInfoResponse userProfile = userService.getUserProfile(id);
        return ResponseEntity.ok(userProfile);
    }

    @Operation(
            summary = "Search Users",
            description = "Search for users by username, first name, or last name. Returns a list of user summaries.",
            parameters = @Parameter(
                    name = "query",
                    description = "Search query string",
                    required = true,
                    example = "john"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Search completed successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            [
                                              {
                                                "id": 1,
                                                "username": "john_doe",
                                                "firstName": "John",
                                                "lastName": "Doe",
                                                "profileImageUrl": "/uploads/avatars/1_profile.jpg"
                                              },
                                              {
                                                "id": 2,
                                                "username": "johnny_smith",
                                                "firstName": "John",
                                                "lastName": "Smith",
                                                "profileImageUrl": null
                                              }
                                            ]"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Empty search query",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/search")
    public ResponseEntity<List<UserSummaryResponse>> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new ValidationException(ErrorCode.REQUIRED_FIELD_MISSING, "Search query cannot be empty");
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
    }

    @Operation(
            summary = "Upload User Avatar",
            description = "Upload a new avatar image for the authenticated user. Supports JPG, PNG formats. Max size: 5MB.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Avatar image file",
                    required = true,
                    content = @Content(
                            mediaType = "multipart/form-data"
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Avatar uploaded successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "message": "Avatar uploaded successfully",
                                              "url": "/uploads/avatars/1_profile.jpg"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid file or validation error",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "timestamp": "2024-01-01T12:00:00Z",
                                              "status": 400,
                                              "error": "Bad Request",
                                              "message": "File must be an image"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            throw new ValidationException(ErrorCode.REQUIRED_FIELD_MISSING, "File is empty");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new ValidationException(ErrorCode.INVALID_FILE_TYPE, "File must be an image");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ValidationException(ErrorCode.FILE_TOO_LARGE, "File size must be less than 5MB");
        }

        String fileName = file.getOriginalFilename();
        String fileUrl = "/uploads/avatars/" + userPrincipal.getId() + "_" + fileName;
        
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setProfileImageUrl(fileUrl);
        
        userService.updateUserProfile(userPrincipal.getId(), updateRequest);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar uploaded successfully");
        response.put("url", fileUrl);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get Users by IDs",
            description = "Retrieve user summaries for a list of user IDs. Useful for bulk user data retrieval.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "List of user IDs",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "User IDs Example",
                                    value = "[1, 2, 3, 4, 5]"
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserSummaryResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Empty user IDs list",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping("/users-by-ids")
    public ResponseEntity<List<UserSummaryResponse>> getUsersByIds(@RequestBody List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new ValidationException(ErrorCode.REQUIRED_FIELD_MISSING, "User IDs list cannot be empty");
        }

        List<UserSummaryResponse> users = userService.getUsersByIds(userIds);
        return ResponseEntity.ok(users);
    }

    @Operation(
            summary = "Deactivate User Account",
            description = "Deactivate the user's own account. Users can only deactivate their own accounts.",
            parameters = @Parameter(
                    name = "id",
                    description = "User ID to deactivate",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Account deactivated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "message": "Account deactivated successfully"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Cannot deactivate other user's account",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "timestamp": "2024-01-01T12:00:00Z",
                                              "status": 403,
                                              "error": "Forbidden",
                                              "message": "You can only deactivate your own account"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @DeleteMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        if (!userPrincipal.getId().equals(id)) {
            throw new ValidationException(ErrorCode.ACCESS_DENIED, "You can only deactivate your own account");
        }

        boolean deactivated = userService.deactivateUser(id);
        if (!deactivated) {
            throw new RuntimeException("Failed to deactivate account");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deactivated successfully");
        return ResponseEntity.ok(response);
    }
} 