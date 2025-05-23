package com.socialmedia.modules.social.service.impl;

import com.socialmedia.modules.social.dto.FriendshipRequest;
import com.socialmedia.modules.social.dto.FriendshipResponse;
import com.socialmedia.shared.exception.exceptions.FriendshipNotFoundException;
import com.socialmedia.shared.exception.exceptions.InvalidFriendshipStatusException;
import com.socialmedia.shared.exception.exceptions.UnauthorizedSocialActionException;
import com.socialmedia.modules.social.service.FriendshipService;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.social.entity.Friendship;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.shared.exception.exceptions.UserNotFoundException;
import com.socialmedia.modules.social.repository.FriendshipRepository;
import com.socialmedia.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FriendshipServiceImpl implements FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public FriendshipResponse sendFriendRequest(FriendshipRequest friendshipRequest, Long requesterId) {
        if (requesterId.equals(friendshipRequest.getAddresseeId())) {
            throw InvalidFriendshipStatusException.cannotBefriendSelf();
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new UserNotFoundException(requesterId));

        User addressee = userRepository.findById(friendshipRequest.getAddresseeId())
                .orElseThrow(() -> new UserNotFoundException(friendshipRequest.getAddresseeId()));

        Optional<Friendship> existingFriendship = friendshipRepository.findFriendshipBetweenUsers(requesterId, friendshipRequest.getAddresseeId());
        if (existingFriendship.isPresent()) {
            throw InvalidFriendshipStatusException.duplicateRequest();
        }

        Friendship friendship = new Friendship(requester, addressee);
        Friendship savedFriendship = friendshipRepository.save(friendship);
        return convertToFriendshipResponse(savedFriendship);
    }

    @Override
    public FriendshipResponse acceptFriendRequest(Long friendshipId, Long userId) {
        Friendship friendship = getFriendshipEntityById(friendshipId);

        if (!friendship.getAddressee().getId().equals(userId)) {
            throw UnauthorizedSocialActionException.forFriendship(userId, friendship.getRequester().getId());
        }

        if (friendship.getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new InvalidFriendshipStatusException(friendship.getStatus().toString(), "ACCEPTED");
        }

        friendship.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        Friendship updatedFriendship = friendshipRepository.save(friendship);
        return convertToFriendshipResponse(updatedFriendship);
    }

    @Override
    public FriendshipResponse rejectFriendRequest(Long friendshipId, Long userId) {
        Friendship friendship = getFriendshipEntityById(friendshipId);

        if (!friendship.getAddressee().getId().equals(userId)) {
            throw UnauthorizedSocialActionException.forFriendship(userId, friendship.getRequester().getId());
        }

        if (friendship.getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new InvalidFriendshipStatusException(friendship.getStatus().toString(), "DECLINED");
        }

        friendship.setStatus(Friendship.FriendshipStatus.DECLINED);
        Friendship updatedFriendship = friendshipRepository.save(friendship);
        return convertToFriendshipResponse(updatedFriendship);
    }

    @Override
    public boolean removeFriend(Long friendshipId, Long userId) {
        Friendship friendship = getFriendshipEntityById(friendshipId);

        if (!friendship.getRequester().getId().equals(userId) && !friendship.getAddressee().getId().equals(userId)) {
            throw UnauthorizedSocialActionException.forFriendship(userId, 
                friendship.getRequester().getId().equals(userId) ? friendship.getAddressee().getId() : friendship.getRequester().getId());
        }

        friendshipRepository.delete(friendship);
        return true;
    }

    @Override
    public boolean unfriend(Long friendId, Long userId) {
        Optional<Friendship> friendship = friendshipRepository.findFriendshipBetweenUsers(userId, friendId);
        if (friendship.isPresent() && friendship.get().getStatus() == Friendship.FriendshipStatus.ACCEPTED) {
            friendshipRepository.delete(friendship.get());
            return true;
        }
        throw new FriendshipNotFoundException(userId, friendId);
    }

    @Override
    @Transactional(readOnly = true)
    public Friendship getFriendshipEntityById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new FriendshipNotFoundException(friendshipId));
    }

    @Override
    @Transactional(readOnly = true)
    public FriendshipResponse getFriendshipById(Long friendshipId) {
        Friendship friendship = getFriendshipEntityById(friendshipId);
        return convertToFriendshipResponse(friendship);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FriendshipResponse> getFriends(Long userId, Pageable pageable) {
        Page<Friendship> friendships = friendshipRepository.findAcceptedFriendshipsByUserId(userId, pageable);
        return friendships.map(this::convertToFriendshipResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FriendshipResponse> getPendingFriendRequests(Long userId, Pageable pageable) {
        Page<Friendship> friendships = friendshipRepository.findPendingFriendRequestsByUserId(userId, pageable);
        return friendships.map(this::convertToFriendshipResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FriendshipResponse> getSentFriendRequests(Long userId, Pageable pageable) {
        Page<Friendship> friendships = friendshipRepository.findSentFriendRequestsByUserId(userId, pageable);
        return friendships.map(this::convertToFriendshipResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public FriendshipResponse getFriendshipBetweenUsers(Long userId1, Long userId2) {
        Optional<Friendship> friendship = friendshipRepository.findFriendshipBetweenUsers(userId1, userId2);
        return friendship.map(this::convertToFriendshipResponse).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean areUsersFriends(Long userId1, Long userId2) {
        return friendshipRepository.areUsersFriends(userId1, userId2);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getFriendCount(Long userId) {
        return friendshipRepository.countFriendsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getPendingRequestCount(Long userId) {
        return friendshipRepository.countPendingFriendRequestsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getFriendIds(Long userId) {
        return friendshipRepository.findFriendIdsByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public String getFriendshipStatus(Long userId1, Long userId2) {
        Optional<Friendship> friendship = friendshipRepository.findFriendshipBetweenUsers(userId1, userId2);
        return friendship.map(f -> f.getStatus().toString()).orElse("NONE");
    }

    private FriendshipResponse convertToFriendshipResponse(Friendship friendship) {
        UserSummaryResponse requesterSummary = new UserSummaryResponse(
                friendship.getRequester().getId(),
                friendship.getRequester().getUsername(),
                friendship.getRequester().getFirstName(),
                friendship.getRequester().getLastName(),
                friendship.getRequester().getProfileImageUrl()
        );

        UserSummaryResponse addresseeSummary = new UserSummaryResponse(
                friendship.getAddressee().getId(),
                friendship.getAddressee().getUsername(),
                friendship.getAddressee().getFirstName(),
                friendship.getAddressee().getLastName(),
                friendship.getAddressee().getProfileImageUrl()
        );

        return new FriendshipResponse(
                friendship.getId(),
                friendship.getStatus().toString(),
                friendship.getCreatedAt(),
                requesterSummary,
                addresseeSummary
        );
    }
} 