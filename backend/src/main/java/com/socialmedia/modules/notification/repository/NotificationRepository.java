package com.socialmedia.modules.notification.repository;

import com.socialmedia.modules.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findNotificationsByUserIdOrderedByCreatedAt(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.readStatus = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadNotificationsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.readStatus = false")
    Long countUnreadNotificationsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type ORDER BY n.createdAt DESC")
    Page<Notification> findNotificationsByUserIdAndType(@Param("userId") Long userId, 
                                                       @Param("type") Notification.NotificationType type, 
                                                       Pageable pageable);
    
    @Modifying
    @Query("UPDATE Notification n SET n.readStatus = true WHERE n.user.id = :userId")
    void markAllNotificationsAsReadByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.readStatus = true WHERE n.id = :notificationId AND n.user.id = :userId")
    void markNotificationAsRead(@Param("notificationId") Long notificationId, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId")
    Long countAllNotificationsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.relatedId = :relatedId AND n.type = :type")
    Page<Notification> findNotificationsByUserIdRelatedIdAndType(@Param("userId") Long userId,
                                                               @Param("relatedId") Long relatedId,
                                                               @Param("type") Notification.NotificationType type,
                                                               Pageable pageable);
    
    void deleteByUserIdAndRelatedIdAndType(Long userId, Long relatedId, Notification.NotificationType type);
} 