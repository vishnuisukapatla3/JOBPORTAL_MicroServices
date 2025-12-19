package com.revjobs.user.repository;

import com.revjobs.user.model.Token;
import com.revjobs.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String token);
    List<Token> findByUser(User user);
    List<Token> findByUserAndRevokedFalse(User user);
}

