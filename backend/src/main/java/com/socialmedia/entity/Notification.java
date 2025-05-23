package com.socialmedia.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @NotBlank
    @Size(max = 500)
    private String content;

    @Column(name = "related_id")
    private Long relatedId;

    @Column(nullable = false)
    private Boolean readStatus = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum NotificationType {
        LIKE,
        COMMENT,
        FRIEND_REQUEST,
        FRIEND_ACCEPTED,
        MESSAGE,
        POST_MENTION,
        COMMENT_MENTION
    }

    public Notification(User user, NotificationType type, String content, Long relatedId) {
        this.user = user;
        this.type = type;
        this.content = content;
        this.relatedId = relatedId;
        this.readStatus = false;
    }
} 