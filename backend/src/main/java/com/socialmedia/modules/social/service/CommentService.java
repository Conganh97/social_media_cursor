package com.socialmedia.modules.social.service;

import com.socialmedia.modules.social.dto.CommentRequest;
import com.socialmedia.modules.social.dto.CommentResponse;
import com.socialmedia.modules.social.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(CommentRequest commentRequest, Long userId);
    CommentResponse getCommentById(Long commentId);
    Comment getCommentEntityById(Long commentId);
    Page<CommentResponse> getCommentsByPostId(Long postId, Pageable pageable);
    Page<CommentResponse> getCommentsByUserId(Long userId, Pageable pageable);
    CommentResponse updateComment(Long commentId, CommentRequest commentRequest, Long userId);
    boolean deleteComment(Long commentId, Long userId);
    Long getCommentCountByPostId(Long postId);
    Long getCommentCountByUserId(Long userId);
    List<CommentResponse> getRecentCommentsByPostId(Long postId, int limit);
} 