package com.b205.ozazak.domain.block.entity;

import com.b205.ozazak.domain.block.vo.CategoryCode;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BlockCategory {
    private final Block block;
    private final CategoryCode code;
}
