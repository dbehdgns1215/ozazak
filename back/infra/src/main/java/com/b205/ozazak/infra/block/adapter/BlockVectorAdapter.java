package com.b205.ozazak.infra.block.adapter;

import com.b205.ozazak.application.block.port.out.BlockVectorPort;
import com.b205.ozazak.infra.block.repository.BlockJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BlockVectorAdapter implements BlockVectorPort {

    private final BlockJpaRepository blockJpaRepository;

    @Override
    public Optional<Double> findMinDistance(Long accountId, String embedding) {
        return blockJpaRepository.findMinDistance(accountId, embedding);
    }

    @Override
    public void updateVector(Long blockId, String vectorStr) {
        blockJpaRepository.updateVector(blockId, vectorStr);
    }
}
