package com.socialmedia.modules.post.controller;

import com.socialmedia.modules.post.dto.PostRequest;
import com.socialmedia.modules.post.dto.PostResponse;
import com.socialmedia.modules.post.dto.PostSummaryResponse;
import com.socialmedia.modules.post.service.PostService;
import com.socialmedia.security.UserPrincipal;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Post Management", description = "Create, read, update, and delete posts")
@SecurityRequirement(name = "Bearer Authentication")
public class PostController {

    @Autowired
    private PostService postService;

    @Operation(
            summary = "Create New Post",
            description = "Create a new post with content and optional image attachments.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Post creation data",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostRequest.class),
                            examples = @ExampleObject(
                                    name = "Post Creation Example",
                                    value = """
                                            {
                                              "content": "Just had an amazing day at the beach! 🏖️ The sunset was incredible.",
                                              "imageUrl": "/uploads/posts/beach_sunset.jpg",
                                              "isPrivate": false
                                            }"""
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Post created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "id": 1,
                                              "content": "Just had an amazing day at the beach! 🏖️ The sunset was incredible.",
                                              "imageUrl": "/uploads/posts/beach_sunset.jpg",
                                              "isPrivate": false,
                                              "createdAt": "2024-01-15T14:30:00Z",
                                              "updatedAt": "2024-01-15T14:30:00Z",
                                              "likeCount": 0,
                                              "commentCount": 0,
                                              "isLikedByCurrentUser": false,
                                              "user": {
                                                "id": 1,
                                                "username": "john_doe",
                                                "firstName": "John",
                                                "lastName": "Doe",
                                                "profileImageUrl": "/uploads/avatars/1_profile.jpg"
                                              }
                                            }"""
                            )
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
            )
    })
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody PostRequest postRequest) {
        PostResponse createdPost = postService.createPost(postRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @Operation(
            summary = "Get Post by ID",
            description = "Retrieve a specific post by its ID with like and comment counts.",
            parameters = @Parameter(
                    name = "id",
                    description = "Post ID",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Post retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Post not found",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "timestamp": "2024-01-01T12:00:00Z",
                                              "status": 404,
                                              "error": "Not Found",
                                              "message": "Post not found with id: 999"
                                            }"""
                            )
                    )
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        PostResponse post = postService.getPostById(id, currentUserId);
        return ResponseEntity.ok(post);
    }

    @Operation(
            summary = "Update Post",
            description = "Update an existing post. Only the post author can update their posts.",
            parameters = @Parameter(
                    name = "id",
                    description = "Post ID to update",
                    required = true,
                    example = "1"
            ),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Post update data",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostRequest.class),
                            examples = @ExampleObject(
                                    name = "Post Update Example",
                                    value = """
                                            {
                                              "content": "Updated: Just had an amazing day at the beach! 🏖️ The sunset was absolutely incredible and unforgettable.",
                                              "imageUrl": "/uploads/posts/beach_sunset_updated.jpg",
                                              "isPrivate": false
                                            }"""
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Post updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Not authorized to update this post",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Post not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody PostRequest postRequest) {
        PostResponse updatedPost = postService.updatePost(id, postRequest, userPrincipal.getId());
        return ResponseEntity.ok(updatedPost);
    }

    @Operation(
            summary = "Delete Post",
            description = "Delete a post. Only the post author can delete their posts.",
            parameters = @Parameter(
                    name = "id",
                    description = "Post ID to delete",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Post deleted successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "message": "Post deleted successfully"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Not authorized to delete this post",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Post not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean deleted = postService.deletePost(id, userPrincipal.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete post");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get Feed Posts",
            description = "Get paginated feed posts for the authenticated user, including posts from friends and public posts.",
            parameters = {
                    @Parameter(name = "page", description = "Page number (0-based)", example = "0"),
                    @Parameter(name = "size", description = "Number of posts per page", example = "10")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Feed posts retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "content": [
                                                {
                                                  "id": 1,
                                                  "content": "Beautiful sunset today!",
                                                  "imageUrl": "/uploads/posts/sunset.jpg",
                                                  "isPrivate": false,
                                                  "createdAt": "2024-01-15T14:30:00Z",
                                                  "likeCount": 25,
                                                  "commentCount": 8,
                                                  "isLikedByCurrentUser": true,
                                                  "user": {
                                                    "id": 2,
                                                    "username": "jane_smith",
                                                    "firstName": "Jane",
                                                    "lastName": "Smith",
                                                    "profileImageUrl": "/uploads/avatars/2_profile.jpg"
                                                  }
                                                }
                                              ],
                                              "pageable": {
                                                "pageNumber": 0,
                                                "pageSize": 10
                                              },
                                              "totalElements": 150,
                                              "totalPages": 15,
                                              "first": true,
                                              "last": false
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
    @GetMapping("/feed")
    public ResponseEntity<Page<PostResponse>> getFeedPosts(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> feedPosts = postService.getFeedPosts(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(feedPosts);
    }

    @Operation(
            summary = "Get User Posts",
            description = "Get paginated posts for a specific user.",
            parameters = {
                    @Parameter(name = "userId", description = "User ID to get posts for", required = true, example = "1"),
                    @Parameter(name = "page", description = "Page number (0-based)", example = "0"),
                    @Parameter(name = "size", description = "Number of posts per page", example = "10")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User posts retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Long currentUserId = userPrincipal != null ? userPrincipal.getId() : null;
        Page<PostResponse> userPosts = postService.getUserPosts(userId, currentUserId, pageable);
        return ResponseEntity.ok(userPosts);
    }

    @Operation(
            summary = "Get Recent Posts",
            description = "Get a list of recent posts for dashboard or widget display.",
            parameters = @Parameter(
                    name = "limit",
                    description = "Maximum number of posts to return",
                    example = "10"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Recent posts retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = PostSummaryResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            [
                                              {
                                                "id": 1,
                                                "content": "Beautiful sunset today! The colors were absolutely stunning...",
                                                "createdAt": "2024-01-15T14:30:00Z",
                                                "likeCount": 25,
                                                "commentCount": 8,
                                                "username": "jane_smith"
                                              },
                                              {
                                                "id": 2,
                                                "content": "Great coffee at the new cafe downtown. Highly recommend...",
                                                "createdAt": "2024-01-15T13:45:00Z",
                                                "likeCount": 12,
                                                "commentCount": 3,
                                                "username": "mike_coffee"
                                              }
                                            ]"""
                            )
                    )
            )
    })
    @GetMapping("/recent")
    public ResponseEntity<List<PostSummaryResponse>> getRecentPosts(@RequestParam(defaultValue = "10") int limit) {
        List<PostSummaryResponse> recentPosts = postService.getRecentPosts(limit);
        return ResponseEntity.ok(recentPosts);
    }

    @Operation(
            summary = "Get Post Count by User",
            description = "Get the total number of posts created by a specific user.",
            parameters = @Parameter(
                    name = "userId",
                    description = "User ID to get post count for",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Post count retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "count": 42
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Long>> getPostCountByUserId(@PathVariable Long userId) {
        Long postCount = postService.getPostCountByUserId(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", postCount);
        return ResponseEntity.ok(response);
    }
} 