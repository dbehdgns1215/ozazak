package com.b205.ozazak.domain.company.entity;

import com.b205.ozazak.domain.company.vo.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class Company {
    private final CompanyId id;
    private final CompanyName name;
    private final CompanyImg img;
    private final CompanyLocation location;
    private final CompanySize size;
}
