package com.socialmedia.modules.messaging.controller;

import com.socialmedia.modules.messaging.dto.MessageRequest;
import com.socialmedia.modules.messaging.dto.MessageResponse;
import com.socialmedia.modules.messaging.dto.ConversationResponse;
import com.socialmedia.modules.messaging.service.MessageService;
import com.socialmedia.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Messaging", description = "APIs for real-time messaging, conversations, and message management with WebSocket support")
@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @Operation(
        summary = "Send Message",
        description = "Send a new message to another user. The message will be delivered in real-time via WebSocket if the recipient is online.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Message content and recipient information",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = MessageRequest.class),
                examples = @ExampleObject(
                    name = "Send Message Example",
                    value = """
                        {
                          "receiverId": 123,
                          "content": "Hello! How are you doing today?",
                          "messageType": "TEXT"
                        }"""
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Message sent successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = MessageResponse.class),
                examples = @ExampleObject(
                    name = "Message Sent",
                    value = """
                        {
                          "id": 456,
                          "content": "Hello! How are you doing today?",
                          "messageType": "TEXT",
                          "readStatus": false,
                          "createdAt": "2024-01-01T12:00:00Z",
                          "sender": {
                            "id": 789,
                            "username": "john_doe",
                            "email": "john@example.com"
                          },
                          "receiver": {
                            "id": 123,
                            "username": "jane_smith",
                            "email": "jane@example.com"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid message request",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "Message content cannot be empty"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Receiver not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody MessageRequest messageRequest,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} sending message to user {}", userPrincipal.getId(), messageRequest.getReceiverId());
        MessageResponse messageResponse = messageService.sendMessage(messageRequest, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(messageResponse);
    }

    @Operation(
        summary = "Get Conversation Messages",
        description = "Retrieve paginated messages from a conversation with another user. Messages are ordered by creation time (newest first)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Conversation messages retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Conversation Messages",
                    value = """
                        {
                          "content": [
                            {
                              "id": 456,
                              "content": "Hello! How are you?",
                              "messageType": "TEXT",
                              "readStatus": true,
                              "createdAt": "2024-01-01T12:00:00Z",
                              "sender": {
                                "id": 789,
                                "username": "john_doe"
                              },
                              "receiver": {
                                "id": 123,
                                "username": "jane_smith"
                              }
                            }
                          ],
                          "pageable": {
                            "pageNumber": 0,
                            "pageSize": 20
                          },
                          "totalElements": 1,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(
            @Parameter(
                description = "ID of the other user in the conversation",
                required = true,
                example = "123"
            )
            @PathVariable Long otherUserId,
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of messages per page",
                example = "20"
            )
            @RequestParam(defaultValue = "20") int size,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting conversation with user {}", userPrincipal.getId(), otherUserId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<MessageResponse> messages = messageService.getConversationMessages(
                userPrincipal.getId(), otherUserId, pageable);
        return ResponseEntity.ok(messages);
    }

    @Operation(
        summary = "Get User Conversations",
        description = "Retrieve all conversations for the authenticated user with pagination. Shows latest message and unread count for each conversation."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User conversations retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "User Conversations",
                    value = """
                        {
                          "content": [
                            {
                              "otherUser": {
                                "id": 123,
                                "username": "jane_smith",
                                "email": "jane@example.com"
                              },
                              "latestMessage": {
                                "content": "See you tomorrow!",
                                "createdAt": "2024-01-01T12:00:00Z"
                              },
                              "unreadCount": 2,
                              "lastActivity": "2024-01-01T12:00:00Z"
                            }
                          ],
                          "totalElements": 1,
                          "totalPages": 1
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/conversations")
    public ResponseEntity<Page<ConversationResponse>> getUserConversations(
            @Parameter(
                description = "Page number (0-based)",
                example = "0"
            )
            @RequestParam(defaultValue = "0") int page,
            @Parameter(
                description = "Number of conversations per page",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int size,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting conversations", userPrincipal.getId());
        Pageable pageable = PageRequest.of(page, size);
        Page<ConversationResponse> conversations = messageService.getUserConversations(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(conversations);
    }

    @Operation(
        summary = "Get Message by ID",
        description = "Retrieve a specific message by its ID. Only participants in the conversation can access the message."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Message retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = MessageResponse.class),
                examples = @ExampleObject(
                    name = "Message Details",
                    value = """
                        {
                          "id": 456,
                          "content": "Hello! How are you doing today?",
                          "messageType": "TEXT",
                          "readStatus": true,
                          "createdAt": "2024-01-01T12:00:00Z",
                          "sender": {
                            "id": 789,
                            "username": "john_doe"
                          },
                          "receiver": {
                            "id": 123,
                            "username": "jane_smith"
                          }
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not participant in conversation"),
        @ApiResponse(responseCode = "404", description = "Message not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{messageId}")
    public ResponseEntity<MessageResponse> getMessageById(
            @Parameter(
                description = "ID of the message to retrieve",
                required = true,
                example = "456"
            )
            @PathVariable Long messageId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting message {}", userPrincipal.getId(), messageId);
        MessageResponse messageResponse = messageService.getMessageById(messageId, userPrincipal.getId());
        return ResponseEntity.ok(messageResponse);
    }

    @Operation(
        summary = "Mark Message as Read",
        description = "Mark a specific message as read by the authenticated user. Updates read status in real-time via WebSocket."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Message marked as read successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Message marked as read"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the recipient"),
        @ApiResponse(responseCode = "404", description = "Message not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{messageId}/read")
    public ResponseEntity<Map<String, String>> markMessageAsRead(
            @Parameter(
                description = "ID of the message to mark as read",
                required = true,
                example = "456"
            )
            @PathVariable Long messageId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} marking message {} as read", userPrincipal.getId(), messageId);
        messageService.markMessageAsRead(messageId, userPrincipal.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Message marked as read");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Mark Conversation as Read",
        description = "Mark all messages in a conversation as read. Useful for bulk read status updates."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Conversation marked as read successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Conversation marked as read"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/conversation/{otherUserId}/read")
    public ResponseEntity<Map<String, String>> markConversationAsRead(
            @Parameter(
                description = "ID of the other user in the conversation",
                required = true,
                example = "123"
            )
            @PathVariable Long otherUserId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} marking conversation with user {} as read", userPrincipal.getId(), otherUserId);
        messageService.markConversationAsRead(userPrincipal.getId(), otherUserId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Conversation marked as read");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Unread Message Count",
        description = "Get the total number of unread messages for the authenticated user across all conversations."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Unread message count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Unread Count",
                    value = """
                        {
                          "unreadCount": 5
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCount(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting unread message count", userPrincipal.getId());
        Long unreadCount = messageService.getUnreadMessageCount(userPrincipal.getId());
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Unread Count for Conversation",
        description = "Get the number of unread messages in a specific conversation with another user."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Conversation unread count retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Conversation Unread Count",
                    value = """
                        {
                          "unreadCount": 2
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/unread/count/{otherUserId}")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCountForConversation(
            @Parameter(
                description = "ID of the other user in the conversation",
                required = true,
                example = "123"
            )
            @PathVariable Long otherUserId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting unread message count for conversation with user {}", userPrincipal.getId(), otherUserId);
        Long unreadCount = messageService.getUnreadMessageCountForConversation(userPrincipal.getId(), otherUserId);
        
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get Recent Messages",
        description = "Retrieve recent messages for the authenticated user across all conversations. Useful for dashboard widgets or quick previews."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Recent messages retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Recent Messages",
                    value = """
                        [
                          {
                            "id": 456,
                            "content": "Hello! How are you?",
                            "messageType": "TEXT",
                            "readStatus": false,
                            "createdAt": "2024-01-01T12:00:00Z",
                            "sender": {
                              "id": 123,
                              "username": "jane_smith"
                            }
                          },
                          {
                            "id": 457,
                            "content": "Thanks for the help!",
                            "messageType": "TEXT",
                            "readStatus": true,
                            "createdAt": "2024-01-01T11:30:00Z",
                            "sender": {
                              "id": 789,
                              "username": "bob_wilson"
                            }
                          }
                        ]"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/recent")
    public ResponseEntity<List<MessageResponse>> getRecentMessages(
            @Parameter(
                description = "Maximum number of recent messages to retrieve",
                example = "10"
            )
            @RequestParam(defaultValue = "10") int limit,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} getting {} recent messages", userPrincipal.getId(), limit);
        List<MessageResponse> messages = messageService.getRecentMessages(userPrincipal.getId(), limit);
        return ResponseEntity.ok(messages);
    }

    @Operation(
        summary = "Delete Message",
        description = "Delete a specific message. Only the sender can delete their own messages. This action cannot be undone."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Message deleted successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Message deleted successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "403", description = "Access denied - not the sender"),
        @ApiResponse(responseCode = "404", description = "Message not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, String>> deleteMessage(
            @Parameter(
                description = "ID of the message to delete",
                required = true,
                example = "456"
            )
            @PathVariable Long messageId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} deleting message {}", userPrincipal.getId(), messageId);
        messageService.deleteMessage(messageId, userPrincipal.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Message deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Search Messages in Conversation",
        description = "Search for messages containing specific text within a conversation. Useful for finding specific information in chat history."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Message search completed successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Search Results",
                    value = """
                        [
                          {
                            "id": 456,
                            "content": "Hello there! How are you?",
                            "messageType": "TEXT",
                            "readStatus": true,
                            "createdAt": "2024-01-01T12:00:00Z",
                            "sender": {
                              "id": 789,
                              "username": "john_doe"
                            }
                          }
                        ]"""
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid search query"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/search")
    public ResponseEntity<List<MessageResponse>> searchMessagesInConversation(
            @Parameter(
                description = "ID of the other user in the conversation",
                required = true,
                example = "123"
            )
            @RequestParam Long otherUserId,
            @Parameter(
                description = "Search query text",
                required = true,
                example = "hello"
            )
            @RequestParam String query,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} searching messages in conversation with user {} for query: {}", 
                userPrincipal.getId(), otherUserId, query);
        List<MessageResponse> messages = messageService.searchMessagesInConversation(
                userPrincipal.getId(), otherUserId, query);
        return ResponseEntity.ok(messages);
    }

    @Operation(
        summary = "Check Conversation Existence",
        description = "Check if a conversation exists between the authenticated user and another user. Returns true if any messages have been exchanged."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Conversation existence check completed",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Conversation Exists",
                    value = """
                        {
                          "hasConversation": true
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/has-conversation/{otherUserId}")
    public ResponseEntity<Map<String, Boolean>> hasConversationWith(
            @Parameter(
                description = "ID of the other user to check conversation with",
                required = true,
                example = "123"
            )
            @PathVariable Long otherUserId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("User {} checking if has conversation with user {}", userPrincipal.getId(), otherUserId);
        boolean hasConversation = messageService.hasConversationWith(userPrincipal.getId(), otherUserId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasConversation", hasConversation);
        return ResponseEntity.ok(response);
    }
} 