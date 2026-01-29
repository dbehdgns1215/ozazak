package com.b205.ozazak.application.community.service;

import com.b205.ozazak.application.community.port.out.LoadCommunityCategoryStatsPort;
import com.b205.ozazak.application.community.port.out.model.CategoryStat;
import com.b205.ozazak.application.community.result.ListCommunityCategoryResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ListCommunityCategoryServiceTest {
    @Mock LoadCommunityCategoryStatsPort loadStatsPort;
    @InjectMocks ListCommunityCategoryService service;

    @Test
    @DisplayName("Should merge DB stats with Catalog and default to 0")
    void mergeLogic() {
        // Given
        // Port returns stats only for Code 1 (TIL)
        CategoryStat stat1 = CategoryStat.builder().communityCode(1).totalCount(10L).todayCount(5L).build();
        when(loadStatsPort.loadStats(any(), any())).thenReturn(Map.of(1, stat1));

        // When
        ListCommunityCategoryResult result = service.list();

        // Then
        // Check Code 1
        var item1 = result.getItems().stream().filter(i -> i.getCommunityCode() == 1).findFirst().get();
        assertThat(item1.getTotalPostCount()).isEqualTo(10L);
        assertThat(item1.getTodayPostCount()).isEqualTo(5L);

        // Check Code 2 (Error Archive) - Should be 0
        var item2 = result.getItems().stream().filter(i -> i.getCommunityCode() == 2).findFirst().get();
        assertThat(item2.getTotalPostCount()).isEqualTo(0L);
        assertThat(item2.getTodayPostCount()).isEqualTo(0L);
        assertThat(item2.getTitle()).isEqualTo("Error Archive");
    }
}
