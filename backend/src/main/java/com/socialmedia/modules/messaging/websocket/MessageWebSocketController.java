package com.socialmedia.modules.messaging.websocket;

import com.socialmedia.modules.messaging.dto.MessageRequest;
import com.socialmedia.modules.messaging.dto.MessageResponse;
import com.socialmedia.modules.messaging.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageRequest messageRequest, Principal principal) {
        try {
            log.info("WebSocket: Sending message from {} to {}", principal.getName(), messageRequest.getReceiverId());
            
            Long senderId = extractUserIdFromPrincipal(principal);
            MessageResponse messageResponse = messageService.sendMessage(messageRequest, senderId);
            
            messagingTemplate.convertAndSendToUser(
                messageRequest.getReceiverId().toString(),
                "/queue/messages",
                messageResponse
            );
            
            messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/messages/sent",
                messageResponse
            );
            
            log.info("WebSocket: Message sent successfully with ID: {}", messageResponse.getId());
        } catch (Exception e) {
            log.error("WebSocket: Error sending message", e);
            
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "Failed to send message: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat.markAsRead")
    public void markMessageAsRead(@Payload Long messageId, Principal principal) {
        try {
            log.info("WebSocket: Marking message {} as read by {}", messageId, principal.getName());
            
            Long userId = extractUserIdFromPrincipal(principal);
            messageService.markMessageAsRead(messageId, userId);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/messages/read",
                messageId
            );
            
            log.info("WebSocket: Message {} marked as read", messageId);
        } catch (Exception e) {
            log.error("WebSocket: Error marking message as read", e);
            
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "Failed to mark message as read: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat.markConversationAsRead")
    public void markConversationAsRead(@Payload Long otherUserId, Principal principal) {
        try {
            log.info("WebSocket: Marking conversation as read between {} and {}", principal.getName(), otherUserId);
            
            Long userId = extractUserIdFromPrincipal(principal);
            messageService.markConversationAsRead(userId, otherUserId);
            
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/conversations/read",
                otherUserId
            );
            
            log.info("WebSocket: Conversation marked as read");
        } catch (Exception e) {
            log.error("WebSocket: Error marking conversation as read", e);
            
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                "Failed to mark conversation as read: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingNotification typingNotification, Principal principal) {
        try {
            log.debug("WebSocket: User {} typing to {}", principal.getName(), typingNotification.getReceiverId());
            
            Long senderId = extractUserIdFromPrincipal(principal);
            typingNotification.setSenderId(senderId);
            
            messagingTemplate.convertAndSendToUser(
                typingNotification.getReceiverId().toString(),
                "/queue/typing",
                typingNotification
            );
        } catch (Exception e) {
            log.error("WebSocket: Error handling typing notification", e);
        }
    }

    @MessageMapping("/chat.online")
    @SendToUser("/queue/reply")
    public String handleOnlineStatus(Principal principal) {
        try {
            log.info("WebSocket: User {} is online", principal.getName());
            
            messagingTemplate.convertAndSend(
                "/topic/users/online",
                principal.getName()
            );
            
            return "Online status updated";
        } catch (Exception e) {
            log.error("WebSocket: Error updating online status", e);
            return "Failed to update online status";
        }
    }

    private Long extractUserIdFromPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            Object details = ((UsernamePasswordAuthenticationToken) principal).getDetails();
            if (details instanceof Long) {
                return (Long) details;
            }
        }
        
        try {
            return Long.parseLong(principal.getName());
        } catch (NumberFormatException e) {
            log.error("Failed to extract user ID from principal: {}", principal.getName());
            throw new RuntimeException("Invalid user ID in principal");
        }
    }

    public static class TypingNotification {
        private Long senderId;
        private Long receiverId;
        private boolean isTyping;

        public TypingNotification() {}

        public TypingNotification(Long senderId, Long receiverId, boolean isTyping) {
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.isTyping = isTyping;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public boolean isTyping() {
            return isTyping;
        }

        public void setTyping(boolean typing) {
            isTyping = typing;
        }
    }
} 