package com.socialmedia.modules.social.repository;

import com.socialmedia.modules.social.entity.Friendship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester.id = :userId OR f.addressee.id = :userId) " +
           "AND f.status = 'ACCEPTED' ORDER BY f.createdAt DESC")
    Page<Friendship> findAcceptedFriendshipsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT f FROM Friendship f WHERE f.addressee.id = :userId AND f.status = 'PENDING' ORDER BY f.createdAt DESC")
    Page<Friendship> findPendingFriendRequestsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT f FROM Friendship f WHERE f.requester.id = :userId AND f.status = 'PENDING' ORDER BY f.createdAt DESC")
    Page<Friendship> findSentFriendRequestsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT f FROM Friendship f WHERE " +
           "((f.requester.id = :userId1 AND f.addressee.id = :userId2) OR " +
           "(f.requester.id = :userId2 AND f.addressee.id = :userId1))")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE " +
           "((f.requester.id = :userId1 AND f.addressee.id = :userId2) OR " +
           "(f.requester.id = :userId2 AND f.addressee.id = :userId1)) " +
           "AND f.status = 'ACCEPTED'")
    boolean areUsersFriends(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT COUNT(f) FROM Friendship f WHERE " +
           "(f.requester.id = :userId OR f.addressee.id = :userId) " +
           "AND f.status = 'ACCEPTED'")
    Long countFriendsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM Friendship f WHERE f.addressee.id = :userId AND f.status = 'PENDING'")
    Long countPendingFriendRequestsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT CASE " +
           "WHEN f.requester.id = :currentUserId THEN f.addressee.id " +
           "ELSE f.requester.id END " +
           "FROM Friendship f WHERE " +
           "(f.requester.id = :currentUserId OR f.addressee.id = :currentUserId) " +
           "AND f.status = 'ACCEPTED'")
    List<Long> findFriendIdsByUserId(@Param("currentUserId") Long currentUserId);
} 