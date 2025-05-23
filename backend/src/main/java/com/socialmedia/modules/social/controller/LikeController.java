package com.socialmedia.modules.social.controller;

import com.socialmedia.modules.social.service.LikeService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.security.UserPrincipal;
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

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
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

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> unlikePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
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

    @PostMapping("/post/{postId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
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

    @GetMapping("/post/{postId}/status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isLiked = likeService.isPostLikedByUser(postId, userPrincipal.getId());
        Long likeCount = likeService.getLikeCountByPostId(postId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", likeCount);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<Page<UserSummaryResponse>> getUsersWhoLikedPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserSummaryResponse> users = likeService.getUsersWhoLikedPost(postId, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<Page<Long>> getPostsLikedByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Long> postIds = likeService.getPostsLikedByUser(userId, pageable);
        return ResponseEntity.ok(postIds);
    }

    @GetMapping("/post/{postId}/recent")
    public ResponseEntity<List<UserSummaryResponse>> getRecentLikersForPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "5") int limit) {
        List<UserSummaryResponse> recentLikers = likeService.getRecentLikersForPost(postId, limit);
        return ResponseEntity.ok(recentLikers);
    }

    @GetMapping("/count/post/{postId}")
    public ResponseEntity<Map<String, Long>> getLikeCountByPostId(@PathVariable Long postId) {
        Long likeCount = likeService.getLikeCountByPostId(postId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", likeCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Map<String, Long>> getLikeCountByUserId(@PathVariable Long userId) {
        Long likeCount = likeService.getLikeCountByUserId(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", likeCount);
        return ResponseEntity.ok(response);
    }
} 