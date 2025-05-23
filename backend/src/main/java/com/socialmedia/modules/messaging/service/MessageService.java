package com.socialmedia.modules.messaging.service;

import com.socialmedia.modules.messaging.dto.MessageRequest;
import com.socialmedia.modules.messaging.dto.MessageResponse;
import com.socialmedia.modules.messaging.dto.ConversationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {
    
    MessageResponse sendMessage(MessageRequest messageRequest, Long senderId);
    
    Page<MessageResponse> getConversationMessages(Long userId, Long otherUserId, Pageable pageable);
    
    Page<ConversationResponse> getUserConversations(Long userId, Pageable pageable);
    
    MessageResponse getMessageById(Long messageId, Long userId);
    
    void markMessageAsRead(Long messageId, Long userId);
    
    void markConversationAsRead(Long userId, Long otherUserId);
    
    Long getUnreadMessageCount(Long userId);
    
    Long getUnreadMessageCountForConversation(Long userId, Long otherUserId);
    
    List<MessageResponse> getRecentMessages(Long userId, int limit);
    
    void deleteMessage(Long messageId, Long userId);
    
    List<MessageResponse> searchMessagesInConversation(Long userId, Long otherUserId, String query);
    
    boolean hasConversationWith(Long userId, Long otherUserId);
} 