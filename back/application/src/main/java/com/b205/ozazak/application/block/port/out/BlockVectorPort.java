package com.b205.ozazak.application.block.port.out;

import java.util.Optional;

public interface BlockVectorPort {
    /**
     * Find minimum cosine distance between account's existing blocks and new embedding
     * @param accountId User account ID
     * @param embedding Embedding vector as string "[0.1,0.2,...]"
     * @return Minimum distance (0-2 range, lower = more similar)
     */
    Optional<Double> findMinDistance(Long accountId, String embedding);

    /**
     * Update vector column of a block
     * @param blockId Block ID
     * @param vectorStr Vector string "[0.1,0.2,...]"
     */
    void updateVector(Long blockId, String vectorStr);
}
