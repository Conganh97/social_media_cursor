package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.dto.FriendshipRequest;
import com.socialmedia.modules.social.dto.FriendshipResponse;
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
    public ResponseEntity<FriendshipResponse> sendFriendRequest(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody FriendshipRequest friendshipRequest) {
        FriendshipResponse friendship = friendshipService.sendFriendRequest(friendshipRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(friendship);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<FriendshipResponse> acceptFriendRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse friendship = friendshipService.acceptFriendRequest(id, userPrincipal.getId());
        return ResponseEntity.ok(friendship);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<FriendshipResponse> rejectFriendRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        FriendshipResponse friendship = friendshipService.rejectFriendRequest(id, userPrincipal.getId());
        return ResponseEntity.ok(friendship);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeFriend(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean removed = friendshipService.removeFriend(id, userPrincipal.getId());
        if (!removed) {
            throw new RuntimeException("Failed to remove friendship");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Friendship removed successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/unfriend/{friendId}")
    public ResponseEntity<Map<String, String>> unfriend(
            @PathVariable Long friendId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean unfriended = friendshipService.unfriend(friendId, userPrincipal.getId());
        if (!unfriended) {
            throw new RuntimeException("Users are not friends or friendship not found");
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User unfriended successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FriendshipResponse> getFriendshipById(@PathVariable Long id) {
        FriendshipResponse friendship = friendshipService.getFriendshipById(id);
        return ResponseEntity.ok(friendship);
    }

    @GetMapping("/my-friends")
    public ResponseEntity<Page<FriendshipResponse>> getMyFriends(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> friends = friendshipService.getFriends(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/user/{userId}/friends")
    public ResponseEntity<Page<FriendshipResponse>> getUserFriends(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> friends = friendshipService.getFriends(userId, pageable);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<Page<FriendshipResponse>> getPendingFriendRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> requests = friendshipService.getPendingFriendRequests(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/sent-requests")
    public ResponseEntity<Page<FriendshipResponse>> getSentFriendRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FriendshipResponse> requests = friendshipService.getSentFriendRequests(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> getFriendshipStatus(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String status = friendshipService.getFriendshipStatus(userPrincipal.getId(), userId);
        boolean areFriends = friendshipService.areUsersFriends(userPrincipal.getId(), userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("areFriends", areFriends);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/between/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Object>> getFriendshipBetweenUsers(
            @PathVariable Long userId1,
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

    @GetMapping("/count/friends/{userId}")
    public ResponseEntity<Map<String, Long>> getFriendCount(@PathVariable Long userId) {
        Long friendCount = friendshipService.getFriendCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", friendCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/pending-requests")
    public ResponseEntity<Map<String, Long>> getPendingRequestCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long pendingCount = friendshipService.getPendingRequestCount(userPrincipal.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("count", pendingCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/friend-ids")
    public ResponseEntity<Map<String, List<Long>>> getFriendIds(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Long> friendIds = friendshipService.getFriendIds(userPrincipal.getId());
        Map<String, List<Long>> response = new HashMap<>();
        response.put("friendIds", friendIds);
        return ResponseEntity.ok(response);
    }
} 