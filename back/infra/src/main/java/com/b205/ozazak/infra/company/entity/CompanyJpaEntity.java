package com.b205.ozazak.infra.company.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class CompanyJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    private String name;
    
    private String img;
    
    private String location;

    private CompanyJpaEntity(String name, String img, String location) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Company name cannot be null or blank");
        }
        this.name = name;
        this.img = img;
        this.location = location;
    }

    public static CompanyJpaEntity create(String name, String img, String location) {
        return new CompanyJpaEntity(name, img, location);
    }
}
