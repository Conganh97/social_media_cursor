package com.socialmedia.modules.messaging.service.impl;

import com.socialmedia.entity.Message;
import com.socialmedia.entity.User;
import com.socialmedia.modules.messaging.dto.MessageRequest;
import com.socialmedia.modules.messaging.dto.MessageResponse;
import com.socialmedia.modules.messaging.dto.ConversationResponse;
import com.socialmedia.modules.messaging.exception.MessageNotFoundException;
import com.socialmedia.modules.messaging.exception.UnauthorizedMessageAccessException;
import com.socialmedia.modules.messaging.service.MessageService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.user.exception.UserNotFoundException;
import com.socialmedia.repository.MessageRepository;
import com.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageResponse sendMessage(MessageRequest messageRequest, Long senderId) {
        log.info("Sending message from user {} to user {}", senderId, messageRequest.getReceiverId());
        
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new UserNotFoundException("Sender not found"));
        User receiver = userRepository.findById(messageRequest.getReceiverId())
            .orElseThrow(() -> new UserNotFoundException("Receiver not found"));

        Message message = Message.builder()
            .content(messageRequest.getContent())
            .sender(sender)
            .receiver(receiver)
            .createdAt(LocalDateTime.now())
            .readStatus(false)
            .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent successfully with ID: {}", savedMessage.getId());
        
        return convertToMessageResponse(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResponse> getConversationMessages(Long userId, Long otherUserId, Pageable pageable) {
        log.info("Getting conversation messages between user {} and user {}", userId, otherUserId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        if (!userRepository.existsById(otherUserId)) {
            throw new UserNotFoundException("Other user not found: " + otherUserId);
        }

        Page<Message> messages = messageRepository.findConversationMessages(userId, otherUserId, pageable);
        return messages.map(this::convertToMessageResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationResponse> getUserConversations(Long userId, Pageable pageable) {
        log.info("Getting conversations for user {}", userId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }

        List<Object[]> conversationData = messageRepository.findUserConversations(userId);
        
        List<ConversationResponse> conversations = conversationData.stream()
            .map(data -> {
                Long otherUserId = (Long) data[0];
                String lastMessageContent = (String) data[1];
                LocalDateTime lastMessageTime = (LocalDateTime) data[2];
                Long unreadCount = (Long) data[3];
                
                User otherUser = userRepository.findById(otherUserId).orElse(null);
                if (otherUser == null) return null;
                
                return ConversationResponse.builder()
                    .conversationPartner(convertToUserSummary(otherUser))
                    .lastMessage(lastMessageContent)
                    .lastMessageTime(lastMessageTime)
                    .unreadCount(unreadCount != null ? unreadCount : 0L)
                    .build();
            })
            .filter(conv -> conv != null)
            .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), conversations.size());
        List<ConversationResponse> pageContent = conversations.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, conversations.size());
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getMessageById(Long messageId, Long userId) {
        log.info("Getting message {} for user {}", messageId, userId);
        
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new MessageNotFoundException("Message not found: " + messageId));
        
        if (!message.getSender().getId().equals(userId) && !message.getReceiver().getId().equals(userId)) {
            throw new UnauthorizedMessageAccessException("Unauthorized access to message: " + messageId);
        }
        
        return convertToMessageResponse(message);
    }

    @Override
    public void markMessageAsRead(Long messageId, Long userId) {
        log.info("Marking message {} as read by user {}", messageId, userId);
        
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new MessageNotFoundException("Message not found: " + messageId));
        
        if (!message.getReceiver().getId().equals(userId)) {
            throw new UnauthorizedMessageAccessException("Only receiver can mark message as read: " + messageId);
        }
        
        message.setReadStatus(true);
        messageRepository.save(message);
        log.info("Message {} marked as read", messageId);
    }

    @Override
    public void markConversationAsRead(Long userId, Long otherUserId) {
        log.info("Marking conversation as read between user {} and user {}", userId, otherUserId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        if (!userRepository.existsById(otherUserId)) {
            throw new UserNotFoundException("Other user not found: " + otherUserId);
        }
        
        int updatedCount = messageRepository.markConversationAsRead(userId, otherUserId);
        log.info("Marked {} messages as read in conversation", updatedCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadMessageCount(Long userId) {
        log.info("Getting unread message count for user {}", userId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        
        return messageRepository.countUnreadMessages(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadMessageCountForConversation(Long userId, Long otherUserId) {
        log.info("Getting unread message count for conversation between user {} and user {}", userId, otherUserId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        if (!userRepository.existsById(otherUserId)) {
            throw new UserNotFoundException("Other user not found: " + otherUserId);
        }
        
        return messageRepository.countUnreadMessagesInConversation(userId, otherUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getRecentMessages(Long userId, int limit) {
        log.info("Getting {} recent messages for user {}", limit, userId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        
        Pageable pageable = Pageable.ofSize(limit);
        List<Message> messages = messageRepository.findRecentMessages(userId, pageable);
        return messages.stream()
            .map(this::convertToMessageResponse)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteMessage(Long messageId, Long userId) {
        log.info("Deleting message {} by user {}", messageId, userId);
        
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new MessageNotFoundException("Message not found: " + messageId));
        
        if (!message.getSender().getId().equals(userId)) {
            throw new UnauthorizedMessageAccessException("Only sender can delete message: " + messageId);
        }
        
        messageRepository.delete(message);
        log.info("Message {} deleted successfully", messageId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> searchMessagesInConversation(Long userId, Long otherUserId, String query) {
        log.info("Searching messages in conversation between user {} and user {} with query: {}", userId, otherUserId, query);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        if (!userRepository.existsById(otherUserId)) {
            throw new UserNotFoundException("Other user not found: " + otherUserId);
        }
        
        List<Message> messages = messageRepository.searchMessagesInConversation(userId, otherUserId, query);
        return messages.stream()
            .map(this::convertToMessageResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasConversationWith(Long userId, Long otherUserId) {
        log.info("Checking if user {} has conversation with user {}", userId, otherUserId);
        
        if (!userRepository.existsById(userId) || !userRepository.existsById(otherUserId)) {
            return false;
        }
        
        return messageRepository.hasConversation(userId, otherUserId);
    }

    private MessageResponse convertToMessageResponse(Message message) {
        return MessageResponse.builder()
            .id(message.getId())
            .content(message.getContent())
            .sender(convertToUserSummary(message.getSender()))
            .receiver(convertToUserSummary(message.getReceiver()))
            .createdAt(message.getCreatedAt())
            .readStatus(message.getReadStatus())
            .build();
    }

    private UserSummaryResponse convertToUserSummary(User user) {
        return UserSummaryResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .profileImageUrl(user.getProfileImageUrl())
            .build();
    }
} 