package com.b205.ozazak.domain.community.entity;

import com.b205.ozazak.domain.community.vo.TagName;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommunityTag {
    private final Community community;
    private final TagName name;
}
