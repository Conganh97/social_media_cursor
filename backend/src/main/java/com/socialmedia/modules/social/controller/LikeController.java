package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.service.LikeService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Social Interactions - Likes", description = "Post likes and user interaction analytics")
@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Operation(
        summary = "Like Post",
        description = "Like a specific post. If the post is already liked by the user, this operation will not create a duplicate like."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Like operation completed",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Post Liked Successfully",
                    value = """
                        {
                          "message": "Post liked successfully",
                          "liked": true,
                          "likeCount": 15
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "200",
            description = "Post already liked",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Post Already Liked",
                    value = """
                        {
                          "message": "Post already liked",
                          "liked": false,
                          "likeCount": 15
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> likePost(
            @Parameter(
                description = "ID of the post to like",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean liked = likeService.likePost(postId, userPrincipal.getId());
        Map<String, Object> response = new HashMap<>();
        
        if (liked) {
            response.put("message", "Post liked successfully");
            response.put("liked", true);
        } else {
            response.put("message", "Post already liked");
            response.put("liked", false);
        }
        
        response.put("likeCount", likeService.getLikeCountByPostId(postId));
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Unlike Post",
        description = "Remove like from a specific post. If the post is not liked by the user, this operation will return a message indicating so."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Unlike operation completed",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Post Unliked Successfully",
                    value = """
                        {
                          "message": "Post unliked successfully",
                          "unliked": true,
                          "likeCount": 14
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "200",
            description = "Post was not liked",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Post Not Liked",
                    value = """
                        {
                          "message": "Post was not liked",
                          "unliked": false,
                          "likeCount": 14
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> unlikePost(
            @Parameter(
                description = "ID of the post to unlike",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean unliked = likeService.unlikePost(postId, userPrincipal.getId());
        Map<String, Object> response = new HashMap<>();
        
        if (unliked) {
            response.put("message", "Post unliked successfully");
            response.put("unliked", true);
        } else {
            response.put("message", "Post was not liked");
            response.put("unliked", false);
        }
        
        response.put("likeCount", likeService.getLikeCountByPostId(postId));
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Toggle Like on Post",
        description = "Toggle like status on a post. If liked, it will unlike; if not liked, it will like. This is the recommended endpoint for like buttons."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Like toggle completed successfully",
            content = @Content(
                mediaType = "application/json",
                examples = {
                    @ExampleObject(
                        name = "Post Liked",
                        value = """
                            {
                              "message": "Post liked successfully",
                              "action": "liked",
                              "success": true,
                              "likeCount": 15,
                              "isLiked": true
                            }"""
                    ),
                    @ExampleObject(
                        name = "Post Unliked",
                        value = """
                            {
                              "message": "Post unliked successfully",
                              "action": "unliked",
                              "success": true,
                              "likeCount": 14,
                              "isLiked": false
                            }"""
                    )
                }
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/post/{postId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @Parameter(
                description = "ID of the post to toggle like",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isLiked = likeService.isPostLikedByUser(postId, userPrincipal.getId());
        boolean result;
        String action;
        
        if (isLiked) {
            result = likeService.unlikePost(postId, userPrincipal.getId());
            action = "unliked";
        } else {
            result = likeService.likePost(postId, userPrincipal.getId());
            action = "liked";
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post " + action + " successfully");
        response.put("action", action);
        response.put("success", result);
        response.put("likeCount", likeService.getLikeCountByPostId(postId));
        response.put("isLiked", !isLiked);
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Like Status",
        description = "Check if a post is liked by the authenticated user and get the total like count for the post."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Like status retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Like Status",
                    value = """
                        {
                          "isLiked": true,
                          "likeCount": 15
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/post/{postId}/status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @Parameter(
                description = "ID of the post to check like status",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isLiked = likeService.isPostLikedByUser(postId, userPrincipal.getId());
        Long likeCount = likeService.getLikeCountByPostId(postId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", likeCount);
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Users Who Liked Post",
        description = "Retrieve a paginated list of users who liked a specific post. Useful for displaying like lists and user interactions."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Users who liked post retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Users Who Liked",
                    value = """
                        {
                          "content": [
                            {
                              "id": 456,
                              "username": "john_doe",
                              "email": "john@example.com",
                              "firstName": "John",
                              "lastName": "Doe"
                            },
                            {
                              "id": 789,
                              "username": "jane_smith",
                              "email": "jane@example.com",
                              "firstName": "Jane",
                              "lastName": "Smith"
                            }
                          ],
                          "totalElements": 15,
                          "totalPages": 2
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/post/{postId}")
    public ResponseEntity<Page<UserSummaryResponse>> getUsersWhoLikedPost(
            @Parameter(
                description = "ID of the post to get likers for",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of users per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserSummaryResponse> users = likeService.getUsersWhoLikedPost(postId, pageable);
        return ResponseEntity.ok(users);
    }

    @Operation(
        summary = "Get Posts Liked by User",
        description = "Retrieve a paginated list of post IDs that were liked by a specific user. Useful for user activity tracking."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Posts liked by user retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Liked Posts",
                    value = """
                        {
                          "content": [123, 456, 789, 101, 202],
                          "totalElements": 25,
                          "totalPages": 3
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<Page<Long>> getPostsLikedByUser(
            @Parameter(
                description = "ID of the user to get liked posts for",
                required = true,
                example = "456"
            )
            @PathVariable Long userId,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of post IDs per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> postIds = likeService.getPostsLikedByUser(userId, pageable);
        return ResponseEntity.ok(postIds);
    }

    @Operation(
        summary = "Get Recent Likers",
        description = "Retrieve a list of users who recently liked a specific post. Useful for showing recent activity and notifications."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Recent likers retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Recent Likers",
                    value = """
                        [
                          {
                            "id": 456,
                            "username": "alice_johnson",
                            "email": "alice@example.com",
                            "firstName": "Alice",
                            "lastName": "Johnson"
                          },
                          {
                            "id": 789,
                            "username": "bob_wilson",
                            "email": "bob@example.com",
                            "firstName": "Bob",
                            "lastName": "Wilson"
                          }
                        ]"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/post/{postId}/recent")
    public ResponseEntity<List<UserSummaryResponse>> getRecentLikersForPost(
            @Parameter(
                description = "ID of the post to get recent likers for",
                required = true,
                example = "123"
            )
            @PathVariable Long postId,
            @Parameter(
                description = "Maximum number of recent likers to retrieve",
                example = "5"
            )
            @RequestParam(defaultValue = "5") int limit) {
        List<UserSummaryResponse> recentLikers = likeService.getRecentLikersForPost(postId, limit);
        return ResponseEntity.ok(recentLikers);
    }

    @Operation(
        summary = "Get Like Count for Post",
        description = "Get the total number of likes for a specific post. Useful for displaying like counters."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Like count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Like Count",
                    value = """
                        {
                          "count": 15
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "Post not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/post/{postId}")
    public ResponseEntity<Map<String, Long>> getLikeCountByPostId(
            @Parameter(
                description = "ID of the post to get like count for",
                required = true,
                example = "123"
            )
            @PathVariable Long postId) {
        Long likeCount = likeService.getLikeCountByPostId(postId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", likeCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Like Count for User",
        description = "Get the total number of likes received by all posts from a specific user. Useful for user statistics."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User like count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "User Like Count",
                    value = """
                        {
                          "count": 247
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Long>> getLikeCountByUserId(
            @Parameter(
                description = "ID of the user to get total likes for",
                required = true,
                example = "456"
            )
            @PathVariable Long userId) {
        Long likeCount = likeService.getLikeCountByUserId(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", likeCount);
        return ResponseEntity.ok(response);
    }
} 