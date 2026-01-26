package com.b205.ozazak.application.account.port.out;

import com.b205.ozazak.domain.account.entity.Account;

import java.util.Optional;

public interface AccountPersistencePort {
    boolean existsByEmail(String email);
    Account save(Account account);
    Optional<Account> findByEmail(String email);
}
