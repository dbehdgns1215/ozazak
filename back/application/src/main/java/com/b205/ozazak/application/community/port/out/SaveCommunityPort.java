package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.domain.community.entity.Community;

public interface SaveCommunityPort {
    Long save(Community community);
}
