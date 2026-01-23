package com.b205.ozazak.infra.reaction.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.community.entity.CommunityJpaEntity;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "reaction")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@IdClass(ReactionJpaEntity.ReactionId.class)
public class ReactionJpaEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private CommunityJpaEntity community;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private AccountJpaEntity account;

    private Integer code;

    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class ReactionId implements Serializable {
        private Long community;
        private Long account;
    }
}
