package com.socialmedia.modules.social.service;

import com.socialmedia.modules.user.dto.UserSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LikeService {
    boolean likePost(Long postId, Long userId);
    boolean unlikePost(Long postId, Long userId);
    boolean isPostLikedByUser(Long postId, Long userId);
    Long getLikeCountByPostId(Long postId);
    Long getLikeCountByUserId(Long userId);
    Page<UserSummaryResponse> getUsersWhoLikedPost(Long postId, Pageable pageable);
    Page<Long> getPostsLikedByUser(Long userId, Pageable pageable);
    List<UserSummaryResponse> getRecentLikersForPost(Long postId, int limit);
} 