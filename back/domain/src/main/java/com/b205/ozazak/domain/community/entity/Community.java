package com.b205.ozazak.domain.community.entity;

import com.b205.ozazak.domain.account.entity.Account;
import com.b205.ozazak.domain.community.vo.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder(toBuilder = true)
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
    
    public static Community create(
            Account author,
            CommunityCode communityCode,
            CommunityTitle title,
            CommunityContent content,
            List<String> tags
    ) {
        return Community.builder()
                .author(author)
                .communityCode(communityCode)
                .title(title)
                .content(content)
                .tags(tags)
                .view(new CommunityView(0))
                .isHot(new IsHot(false))
                .build();
    }

    public Community update(CommunityTitle title, CommunityContent content, List<String> tags) {
        // Validate Tags Rule
        CommunityType type = CommunityType.fromCode(this.communityCode.value());
        if (!type.allowsTags() && tags != null && !tags.isEmpty()) {
             throw new IllegalArgumentException("Tags are not allowed for community type: " + type);
        }
        
        return this.toBuilder()
                .title(title)
                .content(content)
                .tags(tags)
                .build();
    }
}
