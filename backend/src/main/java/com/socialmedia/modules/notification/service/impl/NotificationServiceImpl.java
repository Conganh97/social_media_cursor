package com.socialmedia.modules.notification.service.impl;

import com.socialmedia.modules.notification.entity.Notification;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.notification.dto.NotificationResponse;
import com.socialmedia.modules.notification.dto.NotificationSummary;
import com.socialmedia.shared.exception.exceptions.NotificationNotFoundException;
import com.socialmedia.shared.exception.exceptions.UnauthorizedNotificationAccessException;
import com.socialmedia.modules.notification.service.NotificationService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.shared.exception.exceptions.UserNotFoundException;
import com.socialmedia.modules.notification.repository.NotificationRepository;
import com.socialmedia.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public NotificationResponse createNotification(Long userId, Notification.NotificationType type, String content, Long relatedId) {
        log.info("Creating notification for user ID: {} with type: {}", userId, type);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Notification notification = new Notification(user, type, content, relatedId);
        notification = notificationRepository.save(notification);

        NotificationResponse response = convertToResponse(notification);
        
        sendRealTimeNotification(userId, response);
        
        log.info("Notification created successfully with ID: {}", notification.getId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        log.info("Fetching notifications for user ID: {} with pagination", userId);
        
        Page<Notification> notifications = notificationRepository
                .findNotificationsByUserIdOrderedByCreatedAt(userId, pageable);
        
        return notifications.map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUnreadNotifications(Long userId, Pageable pageable) {
        log.info("Fetching unread notifications for user ID: {}", userId);
        
        Page<Notification> notifications = notificationRepository
                .findUnreadNotificationsByUserId(userId, pageable);
        
        return notifications.map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByType(Long userId, Notification.NotificationType type, Pageable pageable) {
        log.info("Fetching notifications by type {} for user ID: {}", type, userId);
        
        Page<Notification> notifications = notificationRepository
                .findNotificationsByUserIdAndType(userId, type, pageable);
        
        return notifications.map(this::convertToResponse);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        log.info("Marking notification ID: {} as read for user ID: {}", notificationId, userId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedNotificationAccessException("User not authorized to mark this notification as read");
        }

        notification.setReadStatus(true);
        notification = notificationRepository.save(notification);

        NotificationResponse response = convertToResponse(notification);
        
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/topic/notifications/read",
                response
        );

        return response;
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        log.info("Marking all notifications as read for user ID: {}", userId);
        
        notificationRepository.markAllNotificationsAsReadByUserId(userId);
        
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/topic/notifications/read-all",
                "All notifications marked as read"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        log.info("Getting unread notification count for user ID: {}", userId);
        return notificationRepository.countUnreadNotificationsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationSummary getNotificationSummary(Long userId) {
        log.info("Getting notification summary for user ID: {}", userId);

        Long totalUnread = notificationRepository.countUnreadNotificationsByUserId(userId);
        
        Long likeNotifications = getCountByType(userId, Notification.NotificationType.LIKE);
        Long commentNotifications = getCountByType(userId, Notification.NotificationType.COMMENT);
        Long friendRequestNotifications = getCountByType(userId, Notification.NotificationType.FRIEND_REQUEST);
        Long messageNotifications = getCountByType(userId, Notification.NotificationType.MESSAGE);
        Long mentionNotifications = getCountByType(userId, Notification.NotificationType.POST_MENTION) +
                                  getCountByType(userId, Notification.NotificationType.COMMENT_MENTION);

        return new NotificationSummary(
                totalUnread,
                likeNotifications,
                commentNotifications,
                friendRequestNotifications,
                messageNotifications,
                mentionNotifications
        );
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long notificationId, Long userId) {
        log.info("Fetching notification ID: {} for user ID: {}", notificationId, userId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedNotificationAccessException("User not authorized to access this notification");
        }

        return convertToResponse(notification);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        log.info("Deleting notification ID: {} for user ID: {}", notificationId, userId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedNotificationAccessException("User not authorized to delete this notification");
        }

        notificationRepository.delete(notification);
        log.info("Notification deleted successfully");
    }

    @Override
    @Transactional
    public void deleteNotificationsByRelatedId(Long userId, Long relatedId, Notification.NotificationType type) {
        log.info("Deleting notifications for user ID: {} with related ID: {} and type: {}", userId, relatedId, type);
        notificationRepository.deleteByUserIdAndRelatedIdAndType(userId, relatedId, type);
    }

    @Override
    public void sendRealTimeNotification(Long userId, NotificationResponse notification) {
        log.info("Sending real-time notification to user ID: {}", userId);
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/topic/notifications",
                    notification
            );
            log.info("Real-time notification sent successfully");
        } catch (Exception e) {
            log.error("Failed to send real-time notification: {}", e.getMessage(), e);
        }
    }

    private Long getCountByType(Long userId, Notification.NotificationType type) {
        return notificationRepository.findNotificationsByUserIdAndType(userId, type, Pageable.unpaged())
                .getTotalElements();
    }

    private NotificationResponse convertToResponse(Notification notification) {
        UserSummaryResponse relatedUser = null;
        if (notification.getRelatedId() != null) {
            try {
                User user = userRepository.findById(notification.getRelatedId()).orElse(null);
                if (user != null) {
                    relatedUser = new UserSummaryResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getProfileImageUrl()
                    );
                }
            } catch (Exception e) {
                log.warn("Could not load related user for notification: {}", e.getMessage());
            }
        }

        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getContent(),
                notification.getRelatedId(),
                notification.getReadStatus(),
                notification.getCreatedAt(),
                relatedUser
        );
    }
} 