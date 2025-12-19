package com.revjobs.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tokens", indexes = {
    @Index(name = "idx_token_user_id", columnList = "user_id"),
    @Index(name = "idx_token_value", columnList = "token"),
    @Index(name = "idx_token_expires", columnList = "expiresAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_token_user"))
    private User user;
    
    @Column(nullable = false, length = 500)
    private String token;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TokenType tokenType;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(nullable = false)
    private boolean revoked = false;
    
    @Column(length = 100)
    private String deviceInfo;
    
    @Column(length = 45)
    private String ipAddress;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            if (tokenType == TokenType.JWT) {
                expiresAt = LocalDateTime.now().plusHours(24);
            } else if (tokenType == TokenType.OTP) {
                expiresAt = LocalDateTime.now().plusMinutes(5);
            }
        }
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isValid() {
        return !revoked && !isExpired();
    }
}

