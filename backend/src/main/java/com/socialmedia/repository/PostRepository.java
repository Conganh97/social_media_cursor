package com.socialmedia.repository;

import com.socialmedia.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    @Query("SELECT p FROM Post p JOIN p.user u ORDER BY p.createdAt DESC")
    Page<Post> findAllPostsOrderedByCreatedAt(Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    Page<Post> findPostsByUserIdOrderedByCreatedAt(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.user.id IN :friendIds ORDER BY p.createdAt DESC")
    Page<Post> findPostsByUserIds(@Param("friendIds") java.util.List<Long> friendIds, Pageable pageable);
    
    Long countByUserId(Long userId);
} 