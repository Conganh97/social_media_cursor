package com.socialmedia.modules.notification.service;

import com.socialmedia.modules.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEventService {

    private final NotificationService notificationService;

    public void createLikeNotification(Long userId, String likerUsername, Long postId) {
        String content = String.format("%s liked your post", likerUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.LIKE,
                    content,
                    postId
            );
            log.info("Like notification created for user ID: {} from user: {}", userId, likerUsername);
        } catch (Exception e) {
            log.error("Failed to create like notification: {}", e.getMessage(), e);
        }
    }

    public void createCommentNotification(Long userId, String commenterUsername, Long postId) {
        String content = String.format("%s commented on your post", commenterUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.COMMENT,
                    content,
                    postId
            );
            log.info("Comment notification created for user ID: {} from user: {}", userId, commenterUsername);
        } catch (Exception e) {
            log.error("Failed to create comment notification: {}", e.getMessage(), e);
        }
    }

    public void createFriendRequestNotification(Long userId, String requesterUsername, Long requesterId) {
        String content = String.format("%s sent you a friend request", requesterUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.FRIEND_REQUEST,
                    content,
                    requesterId
            );
            log.info("Friend request notification created for user ID: {} from user: {}", userId, requesterUsername);
        } catch (Exception e) {
            log.error("Failed to create friend request notification: {}", e.getMessage(), e);
        }
    }

    public void createFriendAcceptedNotification(Long userId, String accepterUsername, Long accepterId) {
        String content = String.format("%s accepted your friend request", accepterUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.FRIEND_ACCEPTED,
                    content,
                    accepterId
            );
            log.info("Friend accepted notification created for user ID: {} from user: {}", userId, accepterUsername);
        } catch (Exception e) {
            log.error("Failed to create friend accepted notification: {}", e.getMessage(), e);
        }
    }

    public void createMessageNotification(Long userId, String senderUsername, Long messageId) {
        String content = String.format("%s sent you a message", senderUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.MESSAGE,
                    content,
                    messageId
            );
            log.info("Message notification created for user ID: {} from user: {}", userId, senderUsername);
        } catch (Exception e) {
            log.error("Failed to create message notification: {}", e.getMessage(), e);
        }
    }

    public void createPostMentionNotification(Long userId, String mentionerUsername, Long postId) {
        String content = String.format("%s mentioned you in a post", mentionerUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.POST_MENTION,
                    content,
                    postId
            );
            log.info("Post mention notification created for user ID: {} from user: {}", userId, mentionerUsername);
        } catch (Exception e) {
            log.error("Failed to create post mention notification: {}", e.getMessage(), e);
        }
    }

    public void createCommentMentionNotification(Long userId, String mentionerUsername, Long commentId) {
        String content = String.format("%s mentioned you in a comment", mentionerUsername);
        try {
            notificationService.createNotification(
                    userId,
                    Notification.NotificationType.COMMENT_MENTION,
                    content,
                    commentId
            );
            log.info("Comment mention notification created for user ID: {} from user: {}", userId, mentionerUsername);
        } catch (Exception e) {
            log.error("Failed to create comment mention notification: {}", e.getMessage(), e);
        }
    }

    public void removeLikeNotification(Long userId, Long postId) {
        try {
            notificationService.deleteNotificationsByRelatedId(
                    userId,
                    postId,
                    Notification.NotificationType.LIKE
            );
            log.info("Like notification removed for user ID: {} and post ID: {}", userId, postId);
        } catch (Exception e) {
            log.error("Failed to remove like notification: {}", e.getMessage(), e);
        }
    }

    public void removeFriendRequestNotification(Long userId, Long requesterId) {
        try {
            notificationService.deleteNotificationsByRelatedId(
                    userId,
                    requesterId,
                    Notification.NotificationType.FRIEND_REQUEST
            );
            log.info("Friend request notification removed for user ID: {} and requester ID: {}", userId, requesterId);
        } catch (Exception e) {
            log.error("Failed to remove friend request notification: {}", e.getMessage(), e);
        }
    }
} 