package com.b205.ozazak.infra.reaction.repository.projection;

public interface UserReactionProjection {
    Long getCommunityId();
    Integer getReactionCode(); // matches alias 'reactionCode'
}
