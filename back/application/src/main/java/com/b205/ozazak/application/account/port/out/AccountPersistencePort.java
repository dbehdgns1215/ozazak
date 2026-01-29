package com.b205.ozazak.application.account.port.out;

import com.b205.ozazak.domain.account.entity.Account;

import java.util.Optional;

public interface AccountPersistencePort {
    boolean existsByEmail(String email);

    Account save(Account account);
    
    Optional<Account> findByEmail(String email);

    Optional<Account> findById(Long accountId);
    
    // For signup flow: find active user (not deleted)
    Optional<Account> findByEmailAndNotDeleted(String email);
    
    // For signup flow: find deleted user (for recovery)
    Optional<Account> findByEmailAndDeleted(String email);
    
    void deleteUser(Long accountId);
    
    // Recover deleted user
    void recoverUser(Long accountId);
    
    // Recover deleted user and update password (for signup recovery)
    void recoverAndUpdatePassword(Long accountId, String hashedPassword);
}
