package com.socialmedia.modules.social.service;

import com.socialmedia.modules.social.dto.FriendshipRequest;
import com.socialmedia.modules.social.dto.FriendshipResponse;
import com.socialmedia.modules.social.entity.Friendship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FriendshipService {
    FriendshipResponse sendFriendRequest(FriendshipRequest friendshipRequest, Long requesterId);
    FriendshipResponse acceptFriendRequest(Long friendshipId, Long userId);
    FriendshipResponse rejectFriendRequest(Long friendshipId, Long userId);
    boolean removeFriend(Long friendshipId, Long userId);
    boolean unfriend(Long friendId, Long userId);
    Friendship getFriendshipEntityById(Long friendshipId);
    FriendshipResponse getFriendshipById(Long friendshipId);
    Page<FriendshipResponse> getFriends(Long userId, Pageable pageable);
    Page<FriendshipResponse> getPendingFriendRequests(Long userId, Pageable pageable);
    Page<FriendshipResponse> getSentFriendRequests(Long userId, Pageable pageable);
    FriendshipResponse getFriendshipBetweenUsers(Long userId1, Long userId2);
    boolean areUsersFriends(Long userId1, Long userId2);
    Long getFriendCount(Long userId);
    Long getPendingRequestCount(Long userId);
    List<Long> getFriendIds(Long userId);
    String getFriendshipStatus(Long userId1, Long userId2);
} 