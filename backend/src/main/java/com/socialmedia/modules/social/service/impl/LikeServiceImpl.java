package com.socialmedia.modules.social.service.impl;

import com.socialmedia.modules.social.service.LikeService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.entity.Like;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import com.socialmedia.repository.LikeRepository;
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
        try {
            // Check if already liked
            if (isPostLikedByUser(postId, userId)) {
                return false; // Already liked
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setCreatedAt(LocalDateTime.now());

            likeRepository.save(like);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean unlikePost(Long postId, Long userId) {
        try {
            Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
            if (existingLike.isPresent()) {
                likeRepository.delete(existingLike.get());
                return true;
            }
            return false; // Not liked
        } catch (Exception e) {
            return false;
        }
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