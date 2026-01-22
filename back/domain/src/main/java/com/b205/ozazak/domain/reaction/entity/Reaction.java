package com.b205.ozazak.domain.reaction.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.community.entity.Community;
import com.b205.ozazak.domain.reaction.vo.ReactionCode;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Reaction {
    private final Account account;
    private final Community community;
    private final ReactionCode code;
}
