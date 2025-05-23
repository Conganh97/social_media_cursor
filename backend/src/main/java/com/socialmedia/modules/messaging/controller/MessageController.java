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
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody MessageRequest messageRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} sending message to user {}", userPrincipal.getId(), messageRequest.getReceiverId());
        MessageResponse messageResponse = messageService.sendMessage(messageRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(messageResponse);
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting conversation with user {}", userPrincipal.getId(), otherUserId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<MessageResponse> messages = messageService.getConversationMessages(
                userPrincipal.getId(), otherUserId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<ConversationResponse>> getUserConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting conversations", userPrincipal.getId());
        Pageable pageable = PageRequest.of(page, size);
        Page<ConversationResponse> conversations = messageService.getUserConversations(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageResponse> getMessageById(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting message {}", userPrincipal.getId(), messageId);
        MessageResponse messageResponse = messageService.getMessageById(messageId, userPrincipal.getId());
        return ResponseEntity.ok(messageResponse);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Map<String, String>> markMessageAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} marking message {} as read", userPrincipal.getId(), messageId);
        messageService.markMessageAsRead(messageId, userPrincipal.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Message marked as read");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/conversation/{otherUserId}/read")
    public ResponseEntity<Map<String, String>> markConversationAsRead(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} marking conversation with user {} as read", userPrincipal.getId(), otherUserId);
        messageService.markConversationAsRead(userPrincipal.getId(), otherUserId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Conversation marked as read");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCount(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting unread message count", userPrincipal.getId());
        Long unreadCount = messageService.getUnreadMessageCount(userPrincipal.getId());
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count/{otherUserId}")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCountForConversation(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting unread message count for conversation with user {}", userPrincipal.getId(), otherUserId);
        Long unreadCount = messageService.getUnreadMessageCountForConversation(userPrincipal.getId(), otherUserId);
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting {} recent messages", userPrincipal.getId(), limit);
        List<MessageResponse> messages = messageService.getRecentMessages(userPrincipal.getId(), limit);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, String>> deleteMessage(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} deleting message {}", userPrincipal.getId(), messageId);
        messageService.deleteMessage(messageId, userPrincipal.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Message deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MessageResponse>> searchMessagesInConversation(
            @RequestParam Long otherUserId,
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} searching messages in conversation with user {} for query: {}", 
                userPrincipal.getId(), otherUserId, query);
        List<MessageResponse> messages = messageService.searchMessagesInConversation(
                userPrincipal.getId(), otherUserId, query);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/has-conversation/{otherUserId}")
    public ResponseEntity<Map<String, Boolean>> hasConversationWith(
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} checking if has conversation with user {}", userPrincipal.getId(), otherUserId);
        boolean hasConversation = messageService.hasConversationWith(userPrincipal.getId(), otherUserId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasConversation", hasConversation);
        return ResponseEntity.ok(response);
    }
} 