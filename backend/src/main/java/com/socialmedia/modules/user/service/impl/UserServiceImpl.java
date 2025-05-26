package com.socialmedia.modules.user.service.impl;

import com.socialmedia.modules.auth.dto.RegisterRequest;
import com.socialmedia.modules.user.dto.UserInfoResponse;
import com.socialmedia.modules.user.dto.UserSummaryResponse;
import com.socialmedia.modules.user.dto.UserUpdateRequest;
import com.socialmedia.shared.exception.exceptions.UserAlreadyExistsException;
import com.socialmedia.shared.exception.exceptions.UserNotFoundException;
import com.socialmedia.modules.user.service.UserService;
import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(RegisterRequest registerRequest) {
        if (existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username", registerRequest.getUsername());
        }

        if (existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email", registerRequest.getEmail());
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return  userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email : " + username)));
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("email", email));
    }

    @Override
    @Transactional(readOnly = true)
    public UserInfoResponse getUserProfile(Long userId) {
        User user = getUserById(userId);
        return new UserInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfileImageUrl(),
                user.getBio(),
                user.getCreatedAt()
        );
    }

    @Override
    public UserInfoResponse updateUserProfile(Long userId, UserUpdateRequest updateRequest) {
        User user = getUserById(userId);
        
        if (updateRequest.getUsername() != null && !updateRequest.getUsername().equals(user.getUsername())) {
            if (existsByUsername(updateRequest.getUsername())) {
                throw new UserAlreadyExistsException("Username", updateRequest.getUsername());
            }
            user.setUsername(updateRequest.getUsername());
        }
        
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
            if (existsByEmail(updateRequest.getEmail())) {
                throw new UserAlreadyExistsException("Email", updateRequest.getEmail());
            }
            user.setEmail(updateRequest.getEmail());
        }
        
        if (updateRequest.getFirstName() != null) {
            user.setFirstName(updateRequest.getFirstName());
        }
        if (updateRequest.getLastName() != null) {
            user.setLastName(updateRequest.getLastName());
        }
        if (updateRequest.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateRequest.getProfileImageUrl());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }
        
        User savedUser = userRepository.save(user);
        return getUserProfile(savedUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getUsersByIds(List<Long> ids) {
        List<User> users = userRepository.findAllById(ids);
        return users.stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getProfileImageUrl()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public boolean deactivateUser(Long userId) {
        try {
            User user = getUserById(userId);
            user.setActive(false);
            userRepository.save(user);
            return true;
        } catch (UserNotFoundException e) {
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
} 