package com.socialmedia.modules.social.service.impl;

import com.socialmedia.modules.social.service.LikeService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.shared.exception.exceptions.UserNotFoundException;
import com.socialmedia.shared.exception.exceptions.PostNotFoundException;
import com.socialmedia.modules.social.entity.Like;
import com.socialmedia.modules.post.entity.Post;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.social.repository.LikeRepository;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean likePost(Long postId, Long userId) {
        // Check if already liked
        if (isPostLikedByUser(postId, userId)) {
            return false; // Already liked
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        like.setCreatedAt(LocalDateTime.now());

        likeRepository.save(like);
        return true;
    }

    @Override
    public boolean unlikePost(Long postId, Long userId) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return true;
        }
        return false; // Not liked
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPostLikedByUser(Long postId, Long userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getLikeCountByPostId(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getLikeCountByUserId(Long userId) {
        return likeRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryResponse> getUsersWhoLikedPost(Long postId, Pageable pageable) {
        Page<Like> likes = likeRepository.findLikesByPostIdOrderedByCreatedAt(postId, pageable);
        return likes.map(like -> new UserSummaryResponse(
                like.getUser().getId(),
                like.getUser().getUsername(),
                like.getUser().getFirstName(),
                like.getUser().getLastName(),
                like.getUser().getProfileImageUrl()
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Long> getPostsLikedByUser(Long userId, Pageable pageable) {
        Page<Like> likes = likeRepository.findLikesByUserIdOrderedByCreatedAt(userId, pageable);
        return likes.map(like -> like.getPost().getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getRecentLikersForPost(Long postId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Like> likes = likeRepository.findLikesByPostIdOrderedByCreatedAt(postId, pageable);
        
        return likes.getContent().stream()
                .map(like -> new UserSummaryResponse(
                        like.getUser().getId(),
                        like.getUser().getUsername(),
                        like.getUser().getFirstName(),
                        like.getUser().getLastName(),
                        like.getUser().getProfileImageUrl()
                ))
                .collect(Collectors.toList());
    }
} 