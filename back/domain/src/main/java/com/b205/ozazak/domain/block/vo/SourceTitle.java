package com.b205.ozazak.domain.block.vo;

import lombok.Value;

@Value
public class SourceTitle {
    String value;  // nullable - USER_GENERATED blocks have no source
}
