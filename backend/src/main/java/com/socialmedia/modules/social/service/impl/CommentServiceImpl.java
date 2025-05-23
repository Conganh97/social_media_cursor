package com.socialmedia.modules.social.service.impl;

import com.socialmedia.modules.social.dto.CommentRequest;
import com.socialmedia.modules.social.dto.CommentResponse;
import com.socialmedia.modules.social.exception.CommentNotFoundException;
import com.socialmedia.modules.social.exception.UnauthorizedSocialActionException;
import com.socialmedia.modules.social.service.CommentService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.entity.Comment;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import com.socialmedia.repository.CommentRepository;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CommentResponse createComment(CommentRequest commentRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Post post = postRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + commentRequest.getPostId()));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);
        return convertToCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Long commentId) {
        Comment comment = getCommentEntityById(commentId);
        return convertToCommentResponse(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public Comment getCommentEntityById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByPostId(Long postId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findCommentsByPostIdOrderedByCreatedAt(postId, pageable);
        return comments.map(this::convertToCommentResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByUserId(Long userId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findCommentsByUserIdOrderedByCreatedAt(userId, pageable);
        return comments.map(this::convertToCommentResponse);
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest, Long userId) {
        Comment comment = getCommentEntityById(commentId);

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedSocialActionException("update comment", userId);
        }

        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return convertToCommentResponse(updatedComment);
    }

    @Override
    public boolean deleteComment(Long commentId, Long userId) {
        try {
            Comment comment = getCommentEntityById(commentId);

            if (!comment.getUser().getId().equals(userId)) {
                throw new UnauthorizedSocialActionException("delete comment", userId);
            }

            commentRepository.delete(comment);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCommentCountByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getCommentCountByUserId(Long userId) {
        return commentRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getRecentCommentsByPostId(Long postId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Comment> comments = commentRepository.findCommentsByPostIdOrderedByCreatedAt(postId, pageable);
        
        return comments.getContent().stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse convertToCommentResponse(Comment comment) {
        UserSummaryResponse userSummary = new UserSummaryResponse(
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                comment.getUser().getFirstName(),
                comment.getUser().getLastName(),
                comment.getUser().getProfileImageUrl()
        );

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getPost().getId(),
                userSummary
        );
    }
} 