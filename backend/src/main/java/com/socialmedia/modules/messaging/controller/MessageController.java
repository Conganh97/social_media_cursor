package com.socialmedia.modules.messaging.controller;

import com.socialmedia.modules.messaging.dto.MessageRequest;
import com.socialmedia.modules.messaging.dto.MessageResponse;
import com.socialmedia.modules.messaging.dto.ConversationResponse;
import com.socialmedia.modules.messaging.service.MessageService;
import com.socialmedia.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(
            @Valid @RequestBody MessageRequest messageRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} sending message to user {}", userPrincipal.getId(), messageRequest.getReceiverId());
            
            MessageResponse messageResponse = messageService.sendMessage(messageRequest, userPrincipal.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully");
            response.put("data", messageResponse);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Error sending message: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error sending message", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to send message");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<Map<String, Object>> getConversationMessages(
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting conversation with user {}", userPrincipal.getId(), otherUserId);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<MessageResponse> messages = messageService.getConversationMessages(
                    userPrincipal.getId(), otherUserId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messages", messages.getContent());
            response.put("currentPage", messages.getNumber());
            response.put("totalPages", messages.getTotalPages());
            response.put("totalElements", messages.getTotalElements());
            response.put("hasNext", messages.hasNext());
            response.put("hasPrevious", messages.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting conversation messages: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting conversation messages", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get conversation messages");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<Map<String, Object>> getUserConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting conversations", userPrincipal.getId());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ConversationResponse> conversations = messageService.getUserConversations(userPrincipal.getId(), pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("conversations", conversations.getContent());
            response.put("currentPage", conversations.getNumber());
            response.put("totalPages", conversations.getTotalPages());
            response.put("totalElements", conversations.getTotalElements());
            response.put("hasNext", conversations.hasNext());
            response.put("hasPrevious", conversations.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting user conversations: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting user conversations", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get conversations");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> getMessageById(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting message {}", userPrincipal.getId(), messageId);
            
            MessageResponse messageResponse = messageService.getMessageById(messageId, userPrincipal.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", messageResponse);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting message: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting message", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get message");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Map<String, Object>> markMessageAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} marking message {} as read", userPrincipal.getId(), messageId);
            
            messageService.markMessageAsRead(messageId, userPrincipal.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message marked as read");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error marking message as read: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error marking message as read", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to mark message as read");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/conversation/{otherUserId}/read")
    public ResponseEntity<Map<String, Object>> markConversationAsRead(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} marking conversation with user {} as read", userPrincipal.getId(), otherUserId);
            
            messageService.markConversationAsRead(userPrincipal.getId(), otherUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Conversation marked as read");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error marking conversation as read: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error marking conversation as read", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to mark conversation as read");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Object>> getUnreadMessageCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting unread message count", userPrincipal.getId());
            
            Long unreadCount = messageService.getUnreadMessageCount(userPrincipal.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("unreadCount", unreadCount);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting unread message count: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting unread message count", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get unread message count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/unread/count/{otherUserId}")
    public ResponseEntity<Map<String, Object>> getUnreadMessageCountForConversation(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting unread message count for conversation with user {}", userPrincipal.getId(), otherUserId);
            
            Long unreadCount = messageService.getUnreadMessageCountForConversation(userPrincipal.getId(), otherUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("unreadCount", unreadCount);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting unread message count for conversation: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting unread message count for conversation", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get unread message count for conversation");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentMessages(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} getting {} recent messages", userPrincipal.getId(), limit);
            
            List<MessageResponse> messages = messageService.getRecentMessages(userPrincipal.getId(), limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messages", messages);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error getting recent messages: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error getting recent messages", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get recent messages");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} deleting message {}", userPrincipal.getId(), messageId);
            
            messageService.deleteMessage(messageId, userPrincipal.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error deleting message: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error deleting message", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete message");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMessagesInConversation(
            @RequestParam Long otherUserId,
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} searching messages in conversation with user {} for query: {}", 
                    userPrincipal.getId(), otherUserId, query);
            
            List<MessageResponse> messages = messageService.searchMessagesInConversation(
                    userPrincipal.getId(), otherUserId, query);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messages", messages);
            response.put("query", query);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error searching messages: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error searching messages", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to search messages");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/has-conversation/{otherUserId}")
    public ResponseEntity<Map<String, Object>> hasConversationWith(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            log.info("User {} checking if has conversation with user {}", userPrincipal.getId(), otherUserId);
            
            boolean hasConversation = messageService.hasConversationWith(userPrincipal.getId(), otherUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasConversation", hasConversation);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Unexpected error checking conversation existence", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to check conversation existence");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 