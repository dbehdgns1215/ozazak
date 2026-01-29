package com.b205.ozazak.application.block.port.out;

import com.b205.ozazak.domain.block.entity.Block;

public interface SaveBlockPort {
    Block save(Block block);
}
