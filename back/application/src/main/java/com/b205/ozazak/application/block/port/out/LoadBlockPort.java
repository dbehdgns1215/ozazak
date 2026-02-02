package com.b205.ozazak.application.block.port.out;

import com.b205.ozazak.domain.block.entity.Block;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface LoadBlockPort {
    Optional<Block> findById(Long blockId);
    Page<Block> findAllByAccountId(Long accountId, Pageable pageable);
    Page<Block> findAllByAccountIdAndCategory(Long accountId, Integer category, Pageable pageable);
    Page<Block> searchByKeyword(Long accountId, String keyword, Pageable pageable);
    Page<Block> searchByKeywordAndCategory(Long accountId, String keyword, Integer category, Pageable pageable);
}
