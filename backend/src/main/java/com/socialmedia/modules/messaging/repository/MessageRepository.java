package com.socialmedia.modules.messaging.repository;

import com.socialmedia.modules.messaging.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findConversationMessages(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findConversationBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);
    
    @Query("SELECT " +
           "CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END as otherUserId, " +
           "m.content as lastMessage, " +
           "m.createdAt as lastMessageTime, " +
           "0L as unreadCount " +
           "FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) AND " +
           "m.createdAt = (SELECT MAX(m2.createdAt) FROM Message m2 WHERE " +
           "((m2.sender.id = :userId AND m2.receiver.id = CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END) OR " +
           "(m2.receiver.id = :userId AND m2.sender.id = CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END))) " +
           "ORDER BY lastMessageTime DESC")
    List<Object[]> findUserConversations(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Message m SET m.readStatus = true WHERE m.receiver.id = :userId AND " +
           "((m.sender.id = :otherUserId AND m.receiver.id = :userId) OR " +
           "(m.sender.id = :userId AND m.receiver.id = :otherUserId)) AND m.readStatus = false")
    int markConversationAsRead(@Param("userId") Long userId, @Param("otherUserId") Long otherUserId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.readStatus = false")
    Long countUnreadMessages(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.sender.id = :otherUserId AND m.readStatus = false")
    Long countUnreadMessagesInConversation(@Param("userId") Long userId, @Param("otherUserId") Long otherUserId);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId ORDER BY m.createdAt DESC")
    List<Message> findRecentMessages(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) AND " +
           "LOWER(m.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY m.createdAt DESC")
    List<Message> searchMessagesInConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2, @Param("query") String query);
    
    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1))")
    boolean hasConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId AND m.readStatus = false ORDER BY m.createdAt DESC")
    Page<Message> findUnreadMessagesByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.readStatus = false")
    Long countUnreadMessagesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT CASE " +
           "WHEN m.sender.id = :userId THEN m.receiver.id " +
           "ELSE m.sender.id END " +
           "FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId " +
           "ORDER BY MAX(m.createdAt) DESC")
    List<Long> findConversationPartnersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1)) " +
           "ORDER BY m.createdAt DESC")
    List<Message> findLatestMessageBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE " +
           "((m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
           "(m.sender.id = :userId2 AND m.receiver.id = :userId1))")
    Long countMessagesBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId ORDER BY m.createdAt DESC")
    Page<Message> findMessagesBySenderId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :userId ORDER BY m.createdAt DESC")
    Page<Message> findMessagesByReceiverId(@Param("userId") Long userId, Pageable pageable);
} 