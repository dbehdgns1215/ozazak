package com.b205.ozazak.infra.follow.entity;

import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "follow")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@IdClass(FollowJpaEntity.FollowId.class)
public class FollowJpaEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id")
    private AccountJpaEntity follower;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followee_id")
    private AccountJpaEntity followee;

    private FollowJpaEntity(AccountJpaEntity follower, AccountJpaEntity followee) {
        this.follower = follower;
        this.followee = followee;
    }

    public static FollowJpaEntity create(AccountJpaEntity follower, AccountJpaEntity followee) {
        return new FollowJpaEntity(follower, followee);
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class FollowId implements Serializable {
        private Long follower;
        private Long followee;
    }
}
