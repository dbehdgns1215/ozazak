package com.b205.ozazak.infra.comment.repository;

import com.b205.ozazak.infra.comment.entity.CommentJpaEntity;
import com.b205.ozazak.infra.comment.repository.projection.CommentRowProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentJpaRepository extends JpaRepository<CommentJpaEntity, Long> {
    
    @Query("""
        SELECT c.commentId AS commentId,
               a.accountId AS authorId,
               a.name AS authorName,
               a.img AS authorImg,
               co.name AS companyName,
               c.content AS content,
               c.createdAt AS createdAt,
               c.updatedAt AS updatedAt
        FROM CommentJpaEntity c
        INNER JOIN c.account a
        LEFT JOIN CompanyJpaEntity co ON co.companyId = a.companyId
        WHERE c.community.communityId = :communityId
          AND c.deletedAt IS NULL
        ORDER BY c.createdAt ASC, c.commentId ASC
        """)
    List<CommentRowProjection> findByCommunityId(@Param("communityId") Long communityId);
}
