package com.socialmedia.repository;

import com.socialmedia.entity.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    @Query("SELECT l FROM Like l WHERE l.post.id = :postId ORDER BY l.createdAt DESC")
    Page<Like> findLikesByPostIdOrderedByCreatedAt(@Param("postId") Long postId, Pageable pageable);
    
    @Query("SELECT l FROM Like l WHERE l.user.id = :userId ORDER BY l.createdAt DESC")
    Page<Like> findLikesByUserIdOrderedByCreatedAt(@Param("userId") Long userId, Pageable pageable);
    
    Long countByPostId(Long postId);
    
    Long countByUserId(Long userId);
    
    @Query("SELECT l FROM Like l WHERE l.post.id = :postId AND l.user.id = :userId")
    Optional<Like> findByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId);
    
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    
    void deleteByPostIdAndUserId(Long postId, Long userId);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId")
    Long countLikesByPostId(@Param("postId") Long postId);
} 