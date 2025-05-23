package com.socialmedia.modules.post.service;

import com.socialmedia.modules.post.dto.PostRequest;
import com.socialmedia.modules.post.dto.PostResponse;
import com.socialmedia.modules.post.dto.PostSummaryResponse;
import com.socialmedia.modules.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {
    PostResponse createPost(PostRequest postRequest, Long userId);
    PostResponse getPostById(Long postId);
    PostResponse getPostById(Long postId, Long currentUserId);
    Post getPostEntityById(Long postId);
    Page<PostResponse> getFeedPosts(Long userId, Pageable pageable);
    Page<PostResponse> getUserPosts(Long userId, Pageable pageable);
    Page<PostResponse> getUserPosts(Long userId, Long currentUserId, Pageable pageable);
    PostResponse updatePost(Long postId, PostRequest postRequest, Long userId);
    boolean deletePost(Long postId, Long userId);
    List<PostSummaryResponse> getRecentPosts(int limit);
    Long getPostCountByUserId(Long userId);
} 