package com.b205.ozazak.domain.activity.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.activity.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Activity {
    private final ActivityId id;
    private final Account account;
    private final ActivityTitle title;
    private final ActivityCode code;
    private final RankName rankName;
    private final Organization organization;
    private final AwardedAt awardedAt;

    public Activity update(ActivityTitle title, RankName rankName, Organization organization, AwardedAt awardedAt) {
        return Activity.builder()
                .id(this.id)
                .account(this.account)
                .title(title)
                .code(this.code)
                .rankName(rankName)
                .organization(organization)
                .awardedAt(awardedAt)
                .build();
    }
}
