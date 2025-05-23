package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.dto.CommentRequest;
import com.socialmedia.modules.social.dto.CommentResponse;
import com.socialmedia.modules.social.service.CommentService;
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
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Social Interactions", description = "Comments, likes, and friendship management")
@SecurityRequirement(name = "Bearer Authentication")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Operation(
            summary = "Create Comment",
            description = "Add a new comment to a post.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Comment creation data",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentRequest.class),
                            examples = @ExampleObject(
                                    name = "Comment Creation Example",
                                    value = """
                                            {
                                              "postId": 1,
                                              "content": "Great post! I totally agree with your perspective on this topic."
                                            }"""
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Comment created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "id": 1,
                                              "content": "Great post! I totally agree with your perspective on this topic.",
                                              "createdAt": "2024-01-15T15:30:00Z",
                                              "updatedAt": "2024-01-15T15:30:00Z",
                                              "postId": 1,
                                              "user": {
                                                "id": 2,
                                                "username": "jane_smith",
                                                "firstName": "Jane",
                                                "lastName": "Smith",
                                                "profileImageUrl": "/uploads/avatars/2_profile.jpg"
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
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Post not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CommentRequest commentRequest) {
        CommentResponse createdComment = commentService.createComment(commentRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    @Operation(
            summary = "Get Comment by ID",
            description = "Retrieve a specific comment by its ID.",
            parameters = @Parameter(
                    name = "id",
                    description = "Comment ID",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Comment retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Comment not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
        CommentResponse comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @Operation(
            summary = "Update Comment",
            description = "Update an existing comment. Only the comment author can update their comments.",
            parameters = @Parameter(
                    name = "id",
                    description = "Comment ID to update",
                    required = true,
                    example = "1"
            ),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Comment update data",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentRequest.class),
                            examples = @ExampleObject(
                                    name = "Comment Update Example",
                                    value = """
                                            {
                                              "postId": 1,
                                              "content": "Updated comment: Great post! I totally agree with your perspective on this topic and would like to add..."
                                            }"""
                            )
                    )
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Comment updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Not authorized to update this comment",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Comment not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CommentRequest commentRequest) {
        CommentResponse updatedComment = commentService.updateComment(id, commentRequest, userPrincipal.getId());
        return ResponseEntity.ok(updatedComment);
    }

    @Operation(
            summary = "Delete Comment",
            description = "Delete a comment. Only the comment author can delete their comments.",
            parameters = @Parameter(
                    name = "id",
                    description = "Comment ID to delete",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Comment deleted successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "message": "Comment deleted successfully"
                                            }"""
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Not authorized to delete this comment",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Comment not found",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(mediaType = "application/json")
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean deleted = commentService.deleteComment(id, userPrincipal.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete comment");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Comment deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get Comments by Post",
            description = "Get paginated comments for a specific post.",
            parameters = {
                    @Parameter(name = "postId", description = "Post ID to get comments for", required = true, example = "1"),
                    @Parameter(name = "page", description = "Page number (0-based)", example = "0"),
                    @Parameter(name = "size", description = "Number of comments per page", example = "10")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Comments retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Post not found",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/post/{postId}")
    public ResponseEntity<Page<CommentResponse>> getCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getCommentsByPostId(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    @Operation(
            summary = "Get Comments by User",
            description = "Get paginated comments made by a specific user.",
            parameters = {
                    @Parameter(name = "userId", description = "User ID to get comments for", required = true, example = "1"),
                    @Parameter(name = "page", description = "Page number (0-based)", example = "0"),
                    @Parameter(name = "size", description = "Number of comments per page", example = "10")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User comments retrieved successfully",
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
    public ResponseEntity<Page<CommentResponse>> getCommentsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponse> comments = commentService.getCommentsByUserId(userId, pageable);
        return ResponseEntity.ok(comments);
    }

    @Operation(
            summary = "Get Recent Comments",
            description = "Get recent comments for a specific post.",
            parameters = {
                    @Parameter(name = "postId", description = "Post ID to get recent comments for", required = true, example = "1"),
                    @Parameter(name = "limit", description = "Maximum number of comments to return", example = "5")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Recent comments retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CommentResponse.class)
                    )
            )
    })
    @GetMapping("/post/{postId}/recent")
    public ResponseEntity<List<CommentResponse>> getRecentCommentsByPostId(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "5") int limit) {
        List<CommentResponse> recentComments = commentService.getRecentCommentsByPostId(postId, limit);
        return ResponseEntity.ok(recentComments);
    }

    @Operation(
            summary = "Get Comment Count by Post",
            description = "Get the total number of comments for a specific post.",
            parameters = @Parameter(
                    name = "postId",
                    description = "Post ID to get comment count for",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Comment count retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "count": 15
                                            }"""
                            )
                    )
            )
    })
    @GetMapping("/count/post/{postId}")
    public ResponseEntity<Map<String, Long>> getCommentCountByPostId(@PathVariable Long postId) {
        Long commentCount = commentService.getCommentCountByPostId(postId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", commentCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get Comment Count by User",
            description = "Get the total number of comments made by a specific user.",
            parameters = @Parameter(
                    name = "userId",
                    description = "User ID to get comment count for",
                    required = true,
                    example = "1"
            )
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User comment count retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "count": 42
                                            }"""
                            )
                    )
            )
    })
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Long>> getCommentCountByUserId(@PathVariable Long userId) {
        Long commentCount = commentService.getCommentCountByUserId(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", commentCount);
        return ResponseEntity.ok(response);
    }
} 