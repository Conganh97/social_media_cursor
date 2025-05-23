package com.socialmedia.repository;

import com.socialmedia.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt DESC")
    Page<Comment> findCommentsByPostIdOrderedByCreatedAt(@Param("postId") Long postId, Pageable pageable);
    
    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    Page<Comment> findCommentsByUserIdOrderedByCreatedAt(@Param("userId") Long userId, Pageable pageable);
    
    Long countByPostId(Long postId);
    
    Long countByUserId(Long userId);
    
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.user.id = :userId")
    Page<Comment> findCommentsByPostIdAndUserId(@Param("postId") Long postId, @Param("userId") Long userId, Pageable pageable);
} 