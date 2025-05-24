package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.dto.FriendshipRequest;
import com.socialmedia.modules.social.dto.FriendshipResponse;
import com.socialmedia.modules.social.service.FriendshipService;
import com.socialmedia.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Social Interactions - Friendships", description = "Friend requests and relationship management")
@RestController
@RequestMapping("/api/friendships")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @Operation(
        summary = "Send Friend Request",
        description = "Send a friend request to another user. Cannot send multiple requests to the same user or to yourself.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Friend request details",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FriendshipRequest.class),
                examples = @ExampleObject(
                    name = "Friend Request Example",
                    value = """
                        {
                          "friendId": 456,
                          "message": "Hi! I'd like to connect with you."
                        }"""
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Friend request sent successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FriendshipResponse.class),
                examples = @ExampleObject(
                    name = "Friend Request Sent",
                    value = """
                        {
                          "id": 123,
                          "status": "PENDING",
                          "createdAt": "2024-01-01T12:00:00Z",
                          "requester": {
                            "id": 789,
                            "username": "john_doe",
                            "email": "john@example.com"
                          },
                          "addressee": {
                            "id": 456,
                            "username": "jane_smith",
                            "email": "jane@example.com"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request or duplicate friendship",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "Friend request already exists"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/request")
    public ResponseEntity<FriendshipResponse> sendFriendRequest(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody FriendshipRequest friendshipRequest) {
        FriendshipResponse friendship = friendshipService.sendFriendRequest(friendshipRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(friendship);
    }

    @Operation(
        summary = "Accept Friend Request",
        description = "Accept a pending friend request. Only the addressee of the request can accept it."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friend request accepted successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FriendshipResponse.class),
                examples = @ExampleObject(
                    name = "Friend Request Accepted",
                    value = """
                        {
                          "id": 123,
                          "status": "ACCEPTED",
                          "createdAt": "2024-01-01T12:00:00Z",
                          "updatedAt": "2024-01-01T12:05:00Z",
                          "requester": {
                            "id": 789,
                            "username": "john_doe"
                          },
                          "addressee": {
                            "id": 456,
                            "username": "jane_smith"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the addressee"),
        @ApiResponse(responseCode = "404", description = "Friend request not found"),
        @ApiResponse(responseCode = "409", description = "Friend request not in pending status"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{id}/accept")
    public ResponseEntity<FriendshipResponse> acceptFriendRequest(
            @Parameter(
                description = "ID of the friend request to accept",
                required = true,
                example = "123"
            )
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse friendship = friendshipService.acceptFriendRequest(id, userPrincipal.getId());
        return ResponseEntity.ok(friendship);
    }

    @Operation(
        summary = "Reject Friend Request",
        description = "Reject a pending friend request. Only the addressee of the request can reject it."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friend request rejected successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FriendshipResponse.class),
                examples = @ExampleObject(
                    name = "Friend Request Rejected",
                    value = """
                        {
                          "id": 123,
                          "status": "DECLINED",
                          "createdAt": "2024-01-01T12:00:00Z",
                          "updatedAt": "2024-01-01T12:05:00Z",
                          "requester": {
                            "id": 789,
                            "username": "john_doe"
                          },
                          "addressee": {
                            "id": 456,
                            "username": "jane_smith"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the addressee"),
        @ApiResponse(responseCode = "404", description = "Friend request not found"),
        @ApiResponse(responseCode = "409", description = "Friend request not in pending status"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{id}/reject")
    public ResponseEntity<FriendshipResponse> rejectFriendRequest(
            @Parameter(
                description = "ID of the friend request to reject",
                required = true,
                example = "123"
            )
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse friendship = friendshipService.rejectFriendRequest(id, userPrincipal.getId());
        return ResponseEntity.ok(friendship);
    }

    @Operation(
        summary = "Remove Friendship",
        description = "Remove a friendship by its ID. Both friends can remove the friendship."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friendship removed successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Friendship removed successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not a participant in friendship"),
        @ApiResponse(responseCode = "404", description = "Friendship not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeFriend(
            @Parameter(
                description = "ID of the friendship to remove",
                required = true,
                example = "123"
            )
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean removed = friendshipService.removeFriend(id, userPrincipal.getId());
        if (!removed) {
            throw new RuntimeException("Failed to remove friendship");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Friendship removed successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Unfriend User",
        description = "Remove friendship with a specific user by their user ID. More convenient than using friendship ID."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User unfriended successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "User unfriended successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Friendship not found or users are not friends"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/unfriend/{friendId}")
    public ResponseEntity<Map<String, String>> unfriend(
            @Parameter(
                description = "ID of the user to unfriend",
                required = true,
                example = "456"
            )
            @PathVariable Long friendId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean unfriended = friendshipService.unfriend(friendId, userPrincipal.getId());
        if (!unfriended) {
            throw new RuntimeException("Users are not friends or friendship not found");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User unfriended successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Friendship by ID",
        description = "Retrieve detailed information about a specific friendship by its ID."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friendship details retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FriendshipResponse.class),
                examples = @ExampleObject(
                    name = "Friendship Details",
                    value = """
                        {
                          "id": 123,
                          "status": "ACCEPTED",
                          "createdAt": "2024-01-01T12:00:00Z",
                          "updatedAt": "2024-01-01T12:05:00Z",
                          "requester": {
                            "id": 789,
                            "username": "john_doe",
                            "email": "john@example.com"
                          },
                          "addressee": {
                            "id": 456,
                            "username": "jane_smith",
                            "email": "jane@example.com"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "Friendship not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}")
    public ResponseEntity<FriendshipResponse> getFriendshipById(
            @Parameter(
                description = "ID of the friendship to retrieve",
                required = true,
                example = "123"
            )
            @PathVariable Long id) {
        FriendshipResponse friendship = friendshipService.getFriendshipById(id);
        return ResponseEntity.ok(friendship);
    }

    @Operation(
        summary = "Get My Friends",
        description = "Retrieve a paginated list of accepted friendships for the authenticated user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friends list retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Friends List",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "status": "ACCEPTED",
                              "createdAt": "2024-01-01T12:00:00Z",
                              "requester": {
                                "id": 456,
                                "username": "alice_johnson"
                              },
                              "addressee": {
                                "id": 789,
                                "username": "john_doe"
                              }
                            }
                          ],
                          "totalElements": 25,
                          "totalPages": 3
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-friends")
    public ResponseEntity<Page<FriendshipResponse>> getMyFriends(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of friends per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> friends = friendshipService.getFriends(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(friends);
    }

    @Operation(
        summary = "Get User's Friends",
        description = "Retrieve a paginated list of accepted friendships for a specific user. Public endpoint for viewing other users' friends."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User's friends list retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "User Friends List",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "status": "ACCEPTED",
                              "createdAt": "2024-01-01T12:00:00Z",
                              "requester": {
                                "id": 456,
                                "username": "alice_johnson"
                              },
                              "addressee": {
                                "id": 789,
                                "username": "bob_wilson"
                              }
                            }
                          ],
                          "totalElements": 15,
                          "totalPages": 2
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/user/{userId}/friends")
    public ResponseEntity<Page<FriendshipResponse>> getUserFriends(
            @Parameter(
                description = "ID of the user to get friends for",
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
                description = "Number of friends per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> friends = friendshipService.getFriends(userId, pageable);
        return ResponseEntity.ok(friends);
    }

    @Operation(
        summary = "Get Pending Friend Requests",
        description = "Retrieve paginated friend requests received by the authenticated user that are pending approval."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Pending friend requests retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Pending Requests",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "status": "PENDING",
                              "createdAt": "2024-01-01T12:00:00Z",
                              "requester": {
                                "id": 456,
                                "username": "alice_johnson",
                                "email": "alice@example.com"
                              },
                              "addressee": {
                                "id": 789,
                                "username": "john_doe"
                              }
                            }
                          ],
                          "totalElements": 3,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/pending-requests")
    public ResponseEntity<Page<FriendshipResponse>> getPendingFriendRequests(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of requests per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> requests = friendshipService.getPendingFriendRequests(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(requests);
    }

    @Operation(
        summary = "Get Sent Friend Requests",
        description = "Retrieve paginated friend requests sent by the authenticated user that are still pending."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Sent friend requests retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Sent Requests",
                    value = """
                        {
                          "content": [
                            {
                              "id": 123,
                              "status": "PENDING",
                              "createdAt": "2024-01-01T12:00:00Z",
                              "requester": {
                                "id": 789,
                                "username": "john_doe"
                              },
                              "addressee": {
                                "id": 456,
                                "username": "alice_johnson",
                                "email": "alice@example.com"
                              }
                            }
                          ],
                          "totalElements": 2,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/sent-requests")
    public ResponseEntity<Page<FriendshipResponse>> getSentFriendRequests(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of requests per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> requests = friendshipService.getSentFriendRequests(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(requests);
    }

    @Operation(
        summary = "Get Friendship Status",
        description = "Check the friendship status between the authenticated user and another user. Returns status and friendship state."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friendship status retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = {
                    @ExampleObject(
                        name = "Friends",
                        value = """
                            {
                              "status": "ACCEPTED",
                              "areFriends": true
                            }"""
                    ),
                    @ExampleObject(
                        name = "Pending Request",
                        value = """
                            {
                              "status": "PENDING",
                              "areFriends": false
                            }"""
                    ),
                    @ExampleObject(
                        name = "No Relationship",
                        value = """
                            {
                              "status": "NONE",
                              "areFriends": false
                            }"""
                    )
                }
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> getFriendshipStatus(
            @Parameter(
                description = "ID of the user to check friendship status with",
                required = true,
                example = "456"
            )
            @PathVariable Long userId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String status = friendshipService.getFriendshipStatus(userPrincipal.getId(), userId);
        boolean areFriends = friendshipService.areUsersFriends(userPrincipal.getId(), userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("areFriends", areFriends);
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Friendship Between Users",
        description = "Retrieve friendship details between two specific users. Useful for checking relationships between other users."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friendship information retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = {
                    @ExampleObject(
                        name = "Friendship Exists",
                        value = """
                            {
                              "friendship": {
                                "id": 123,
                                "status": "ACCEPTED",
                                "createdAt": "2024-01-01T12:00:00Z",
                                "requester": {
                                  "id": 456,
                                  "username": "alice_johnson"
                                },
                                "addressee": {
                                  "id": 789,
                                  "username": "bob_wilson"
                                }
                              }
                            }"""
                    ),
                    @ExampleObject(
                        name = "No Friendship",
                        value = """
                            {
                              "message": "No friendship exists between these users"
                            }"""
                    )
                }
            )
        ),
        @ApiResponse(responseCode = "404", description = "One or both users not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/between/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Object>> getFriendshipBetweenUsers(
            @Parameter(
                description = "ID of the first user",
                required = true,
                example = "456"
            )
            @PathVariable Long userId1,
            @Parameter(
                description = "ID of the second user",
                required = true,
                example = "789"
            )
            @PathVariable Long userId2) {
        FriendshipResponse friendship = friendshipService.getFriendshipBetweenUsers(userId1, userId2);
        if (friendship != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("friendship", friendship);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "No friendship exists between these users");
            return ResponseEntity.ok(response);
        }
    }

    @Operation(
        summary = "Get Friend Count",
        description = "Get the total number of accepted friends for a specific user. Useful for profile statistics."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friend count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Friend Count",
                    value = """
                        {
                          "count": 25
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/friends/{userId}")
    public ResponseEntity<Map<String, Long>> getFriendCount(
            @Parameter(
                description = "ID of the user to get friend count for",
                required = true,
                example = "456"
            )
            @PathVariable Long userId) {
        Long friendCount = friendshipService.getFriendCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", friendCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Pending Request Count",
        description = "Get the number of pending friend requests for the authenticated user. Perfect for notification badges."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Pending request count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Pending Request Count",
                    value = """
                        {
                          "count": 3
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/pending-requests")
    public ResponseEntity<Map<String, Long>> getPendingRequestCount(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long pendingCount = friendshipService.getPendingRequestCount(userPrincipal.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("count", pendingCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Friend IDs",
        description = "Get a list of user IDs who are friends with the authenticated user. Useful for filtering and permission checks."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Friend IDs retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Friend IDs",
                    value = """
                        {
                          "friendIds": [456, 789, 101, 202, 303]
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/friend-ids")
    public ResponseEntity<Map<String, List<Long>>> getFriendIds(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Long> friendIds = friendshipService.getFriendIds(userPrincipal.getId());
        Map<String, List<Long>> response = new HashMap<>();
        response.put("friendIds", friendIds);
        return ResponseEntity.ok(response);
    }
} 