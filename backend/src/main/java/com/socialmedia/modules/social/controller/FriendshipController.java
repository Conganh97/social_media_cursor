package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.dto.FriendshipRequest;
import com.socialmedia.modules.social.dto.FriendshipResponse;
import com.socialmedia.modules.social.exception.FriendshipNotFoundException;
import com.socialmedia.modules.social.exception.InvalidFriendshipStatusException;
import com.socialmedia.modules.social.exception.UnauthorizedSocialActionException;
import com.socialmedia.modules.social.service.FriendshipService;
import com.socialmedia.security.UserPrincipal;
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

@RestController
@RequestMapping("/api/friendships")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody FriendshipRequest friendshipRequest) {
        try {
            FriendshipResponse friendship = friendshipService.sendFriendRequest(friendshipRequest, userPrincipal.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(friendship);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send friend request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptFriendRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            FriendshipResponse friendship = friendshipService.acceptFriendRequest(id, userPrincipal.getId());
            return ResponseEntity.ok(friendship);
        } catch (FriendshipNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (UnauthorizedSocialActionException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (InvalidFriendshipStatusException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectFriendRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            FriendshipResponse friendship = friendshipService.rejectFriendRequest(id, userPrincipal.getId());
            return ResponseEntity.ok(friendship);
        } catch (FriendshipNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (UnauthorizedSocialActionException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (InvalidFriendshipStatusException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFriend(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            boolean removed = friendshipService.removeFriend(id, userPrincipal.getId());
            if (removed) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Friendship removed successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Failed to remove friendship");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            }
        } catch (FriendshipNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (UnauthorizedSocialActionException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }
    }

    @DeleteMapping("/unfriend/{friendId}")
    public ResponseEntity<?> unfriend(
            @PathVariable Long friendId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            boolean unfriended = friendshipService.unfriend(friendId, userPrincipal.getId());
            if (unfriended) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User unfriended successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Users are not friends or friendship not found");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to unfriend user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFriendshipById(@PathVariable Long id) {
        try {
            FriendshipResponse friendship = friendshipService.getFriendshipById(id);
            return ResponseEntity.ok(friendship);
        } catch (FriendshipNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/my-friends")
    public ResponseEntity<?> getMyFriends(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FriendshipResponse> friends = friendshipService.getFriends(userPrincipal.getId(), pageable);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch friends: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user/{userId}/friends")
    public ResponseEntity<?> getUserFriends(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FriendshipResponse> friends = friendshipService.getFriends(userId, pageable);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user friends: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingFriendRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FriendshipResponse> requests = friendshipService.getPendingFriendRequests(userPrincipal.getId(), pageable);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch pending requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/sent-requests")
    public ResponseEntity<?> getSentFriendRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FriendshipResponse> requests = friendshipService.getSentFriendRequests(userPrincipal.getId(), pageable);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch sent requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getFriendshipStatus(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String status = friendshipService.getFriendshipStatus(userPrincipal.getId(), userId);
            boolean areFriends = friendshipService.areUsersFriends(userPrincipal.getId(), userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("areFriends", areFriends);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch friendship status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/between/{userId1}/{userId2}")
    public ResponseEntity<?> getFriendshipBetweenUsers(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        try {
            FriendshipResponse friendship = friendshipService.getFriendshipBetweenUsers(userId1, userId2);
            if (friendship != null) {
                return ResponseEntity.ok(friendship);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No friendship exists between these users");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch friendship: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/count/friends/{userId}")
    public ResponseEntity<?> getFriendCount(@PathVariable Long userId) {
        try {
            Long friendCount = friendshipService.getFriendCount(userId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", friendCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch friend count: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/count/pending-requests")
    public ResponseEntity<?> getPendingRequestCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Long pendingCount = friendshipService.getPendingRequestCount(userPrincipal.getId());
            Map<String, Long> response = new HashMap<>();
            response.put("count", pendingCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch pending request count: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/friend-ids")
    public ResponseEntity<?> getFriendIds(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            List<Long> friendIds = friendshipService.getFriendIds(userPrincipal.getId());
            Map<String, List<Long>> response = new HashMap<>();
            response.put("friendIds", friendIds);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch friend IDs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
} 