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
    public ResponseEntity<?> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
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
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to like post: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<?> unlikePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
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
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to unlike post: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/post/{postId}/toggle")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
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
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to toggle like: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/post/{postId}/status")
    public ResponseEntity<?> getLikeStatus(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            boolean isLiked = likeService.isPostLikedByUser(postId, userPrincipal.getId());
            Long likeCount = likeService.getLikeCountByPostId(postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch like status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getUsersWhoLikedPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserSummaryResponse> users = likeService.getUsersWhoLikedPost(postId, pageable);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch users who liked post: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<?> getPostsLikedByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Long> postIds = likeService.getPostsLikedByUser(userId, pageable);
            return ResponseEntity.ok(postIds);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch liked posts: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/post/{postId}/recent")
    public ResponseEntity<?> getRecentLikersForPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<UserSummaryResponse> recentLikers = likeService.getRecentLikersForPost(postId, limit);
            return ResponseEntity.ok(recentLikers);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch recent likers: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/count/post/{postId}")
    public ResponseEntity<?> getLikeCountByPostId(@PathVariable Long postId) {
        try {
            Long likeCount = likeService.getLikeCountByPostId(postId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", likeCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch like count: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/count/user/{userId}")
    public ResponseEntity<?> getLikeCountByUserId(@PathVariable Long userId) {
        try {
            Long likeCount = likeService.getLikeCountByUserId(userId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", likeCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user like count: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 