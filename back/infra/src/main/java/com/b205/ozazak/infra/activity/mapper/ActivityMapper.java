package com.b205.ozazak.infra.activity.mapper;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.activity.entity.Activity;
import com.b205.ozazak.domain.activity.vo.*;
import com.b205.ozazak.infra.account.entity.AccountJpaEntity;
import com.b205.ozazak.infra.activity.entity.ActivityJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {

    public Activity toDomain(ActivityJpaEntity jpaEntity, Account account) {
        return Activity.builder()
                .id(new ActivityId(jpaEntity.getActivityId()))
                .account(account)
                .title(new ActivityTitle(jpaEntity.getTitle()))
                .code(new ActivityCode(jpaEntity.getCode()))
                .rankName(new RankName(jpaEntity.getRankName() != null ? jpaEntity.getRankName() : ""))
                .organization(new Organization(jpaEntity.getOrganization() != null ? jpaEntity.getOrganization() : ""))
                .awardedAt(new AwardedAt(jpaEntity.getAwardedAt()))
                .build();
    }

    public ActivityJpaEntity toJpa(Activity activity, AccountJpaEntity accountJpaEntity) {
        return ActivityJpaEntity.create(
                accountJpaEntity,
                activity.getTitle().value(),
                activity.getCode().value(),
                activity.getRankName().value(),
                activity.getOrganization().value(),
                activity.getAwardedAt().value()
        );
    }
}
