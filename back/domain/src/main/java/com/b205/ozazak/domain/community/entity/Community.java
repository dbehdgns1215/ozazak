package com.b205.ozazak.domain.community.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.community.vo.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class Community {
    private final CommunityId id;
    private final Account author;
    private final CommunityTitle title;
    private final CommunityContent content;
    private final CommunityView view;
    private final CommunityCode communityCode;
    private final IsHot isHot;
    private final CreatedAt createdAt;
    private final UpdatedAt updatedAt;
    
    // Additional fields for list view
    private final List<String> tags;
    private final Long commentCount;
    private final Long reactionCount;
}
