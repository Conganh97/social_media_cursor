package com.socialmedia.modules.social.service.impl;

import com.socialmedia.modules.social.dto.CommentRequest;
import com.socialmedia.modules.social.dto.CommentResponse;
import com.socialmedia.shared.exception.exceptions.CommentNotFoundException;
import com.socialmedia.shared.exception.exceptions.UnauthorizedSocialActionException;
import com.socialmedia.modules.social.service.CommentService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.shared.exception.exceptions.UserNotFoundException;
import com.socialmedia.shared.exception.exceptions.PostNotFoundException;
import com.socialmedia.modules.social.entity.Comment;
import com.socialmedia.modules.post.entity.Post;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.social.repository.CommentRepository;
import com.socialmedia.modules.post.repository.PostRepository;
import com.socialmedia.modules.user.repository.UserRepository;
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
                .orElseThrow(() -> new UserNotFoundException(userId));

        Post post = postRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new PostNotFoundException(commentRequest.getPostId()));

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
            throw UnauthorizedSocialActionException.forComment(commentId, userId);
        }

        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return convertToCommentResponse(updatedComment);
    }

    @Override
    public boolean deleteComment(Long commentId, Long userId) {
        Comment comment = getCommentEntityById(commentId);

        if (!comment.getUser().getId().equals(userId)) {
            throw UnauthorizedSocialActionException.forComment(commentId, userId);
        }

        commentRepository.delete(comment);
        return true;
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