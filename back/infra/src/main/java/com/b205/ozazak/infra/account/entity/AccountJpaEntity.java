package com.b205.ozazak.infra.account.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class AccountJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String img;

    @Column(name = "role_code", nullable = false)
    private Integer roleCode;

    @Column(name = "company_id")
    private Long companyId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    private AccountJpaEntity(String email, String password, String name, String img, Integer roleCode, Long companyId) {
        validateEmail(email);
        validateName(name);
        this.email = email;
        this.password = password;
        this.name = name;
        this.img = img;
        this.roleCode = roleCode;
        this.companyId = companyId;
    }

    public static AccountJpaEntity create(String email, String password, String name, String img, Integer roleCode, Long companyId) {
        return new AccountJpaEntity(email, password, name, img, roleCode, companyId);
    }

    public void updateProfile(String name, String img) {
        validateName(name);
        this.name = name;
        this.img = img;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    private void validateEmail(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private void validateName(String name) {
        if (name == null || name.isBlank() || name.length() < 2) {
            throw new IllegalArgumentException("Name must be at least 2 characters");
        }
    }
}
