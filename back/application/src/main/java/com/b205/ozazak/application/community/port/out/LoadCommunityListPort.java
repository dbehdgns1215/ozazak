package com.b205.ozazak.application.community.port.out;

import com.b205.ozazak.application.community.port.out.dto.CommunityListPage;
import com.b205.ozazak.application.community.port.out.dto.ListCommunityQuery;

public interface LoadCommunityListPort {
    CommunityListPage loadCommunityList(ListCommunityQuery query);
}
