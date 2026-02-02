package com.b205.ozazak.application.block.service;

import java.util.List;
import java.util.Map;

/**
 * 블록 카테고리 이름 ↔ 코드 변환 유틸리티
 */
public class BlockCategoryMapper {

    private static final Map<String, Integer> NAME_TO_CODE = Map.ofEntries(
            Map.entry("성장과정, 가치관", 0),
            Map.entry("성장과정", 0),
            Map.entry("가치관", 0),
            Map.entry("성격의 장점", 1),
            Map.entry("성격의 단점 및 극복", 2),
            Map.entry("성격의 단점", 2),
            Map.entry("팀워크, 협업", 3),
            Map.entry("팀워크", 3),
            Map.entry("협업", 3),
            Map.entry("갈등 해결", 4),
            Map.entry("리더십, 주도성", 5),
            Map.entry("리더십", 5),
            Map.entry("주도성", 5),
            Map.entry("의사소통 능력", 6),
            Map.entry("의사소통", 6),
            Map.entry("기술적 문제 해결", 7),
            Map.entry("문제 해결", 7),
            Map.entry("성능 최적화, 개선", 8),
            Map.entry("성능 최적화", 8),
            Map.entry("개선", 8),
            Map.entry("신기술 습득, 학습 능력", 9),
            Map.entry("신기술 습득", 9),
            Map.entry("학습 능력", 9),
            Map.entry("설계 및 아키텍처", 10),
            Map.entry("설계", 10),
            Map.entry("아키텍처", 10),
            Map.entry("도전, 실패 극복", 11),
            Map.entry("도전", 11),
            Map.entry("실패 극복", 11),
            Map.entry("지원 동기", 12),
            Map.entry("입사 후 포부", 13),
            Map.entry("포부", 13),
            Map.entry("관심 분야, 트렌드 분석", 14),
            Map.entry("관심 분야", 14),
            Map.entry("트렌드 분석", 14)
    );

    private static final Map<Integer, String> CODE_TO_NAME = Map.ofEntries(
            Map.entry(0, "성장과정, 가치관"),
            Map.entry(1, "성격의 장점"),
            Map.entry(2, "성격의 단점 및 극복"),
            Map.entry(3, "팀워크, 협업"),
            Map.entry(4, "갈등 해결"),
            Map.entry(5, "리더십, 주도성"),
            Map.entry(6, "의사소통 능력"),
            Map.entry(7, "기술적 문제 해결"),
            Map.entry(8, "성능 최적화, 개선"),
            Map.entry(9, "신기술 습득, 학습 능력"),
            Map.entry(10, "설계 및 아키텍처"),
            Map.entry(11, "도전, 실패 극복"),
            Map.entry(12, "지원 동기"),
            Map.entry(13, "입사 후 포부"),
            Map.entry(14, "관심 분야, 트렌드 분석")
    );

    /**
     * 카테고리 이름을 코드로 변환
     */
    public static Integer toCode(String categoryName) {
        if (categoryName == null) return null;
        return NAME_TO_CODE.get(categoryName.trim());
    }

    /**
     * 카테고리 코드를 이름으로 변환
     */
    public static String toName(Integer code) {
        if (code == null) return null;
        return CODE_TO_NAME.get(code);
    }

    /**
     * 카테고리 이름 리스트를 코드 리스트로 변환
     */
    public static List<Integer> toCodes(List<String> categoryNames) {
        if (categoryNames == null) return List.of();
        return categoryNames.stream()
                .map(BlockCategoryMapper::toCode)
                .filter(code -> code != null)  // 알 수 없는 카테고리 무시
                .distinct()
                .toList();
    }

    /**
     * 카테고리 코드 리스트를 이름 리스트로 변환
     */
    public static List<String> toNames(List<Integer> codes) {
        if (codes == null) return List.of();
        return codes.stream()
                .map(BlockCategoryMapper::toName)
                .filter(name -> name != null)
                .toList();
    }
}
