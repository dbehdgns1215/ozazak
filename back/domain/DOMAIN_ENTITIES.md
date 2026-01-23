# Domain Entities Summary

All domain entities have been created following the Hexagonal Architecture principles and VO pattern.

## Package: com.b205.ozazak.domain

### Created Entities (17 total)

1. **Account** (`domain.account.entity`)
   - Fields: AccountId, AccountName, AccountImg, Role (User, Admin)
   - Pure Java entity with VO pattern

2. **Activity** (`domain.activity.entity`)
   - Fields: ActivityId, Account, ActivityTitle, ActivityCode, RankName, Organization, AwardedAt
   - Represents awards and certifications

3. **Block** (`domain.block.entity`)
   - Fields: BlockId, Account, BlockTitle, BlockContent, Vector, DeletedAt
   - Content block entity

4. **BlockCategory** (`domain.block.entity`)
   - Fields: Block, CategoryCode
   - Many-to-many relationship entity

5. **Bookmark** (`domain.bookmark.entity`)
   - Fields: Account, Recruitment, CreatedAt
   - Composite key entity

6. **Comment** (`domain.comment.entity`)
   - Fields: CommentId, Community, Account, CommentContent, CreatedAt, UpdatedAt, DeletedAt
   - Comment entity for community posts

7. **Community** (`domain.community.entity`)
   - Fields: CommunityId, Account (author), CommunityTitle, CommunityContent, CommunityView, CommunityCode, IsHot, CreatedAt, UpdatedAt
   - Main community post entity

8. **CommunityTag** (`domain.community.entity`)
   - Fields: Community, TagName
   - Tags for TIL posts

9. **Company** (`domain.company.entity`)
   - Fields: CompanyId, CompanyName, CompanyImg, CompanyLocation
   - Company information entity

10. **Coverletter** (`domain.coverletter.entity`)
    - Fields: CoverletterId, Account, Recruitment, CoverletterTitle, IsComplete, IsPassed, CreatedAt, UpdatedAt, DeletedAt
    - Cover letter entity

11. **Essay** (`domain.essay.entity`)
    - Fields: EssayId, Coverletter, Question, EssayContent, Version, VersionTitle, IsCurrent, DeletedAt
    - Essay version management entity

12. **Follow** (`domain.follow.entity`)
    - Fields: follower (Account), followee (Account)
    - Follow relationship entity

13. **Project** (`domain.project.entity`)
    - Fields: ProjectId, Account, ProjectTitle, ProjectContent, ProjectImage, StartedAt, EndedAt, CreatedAt, UpdatedAt, DeletedAt
    - Project portfolio entity

14. **ProjectTag** (`domain.project.entity`)
    - Fields: Project, TagName
    - Tags for projects

15. **Question** (`domain.question.entity`)
    - Fields: QuestionId, Recruitment, QuestionContent, OrderValue, CharMax
    - Cover letter questions

16. **Reaction** (`domain.reaction.entity`)
    - Fields: Community, Account, ReactionCode
    - Reaction/emoji for community posts

17. **Recruitment** (`domain.recruitment.entity`)
    - Fields: RecruitmentId, Company, RecruitmentTitle, RecruitmentContent, StartedAt, EndedAt, ApplyUrl, CreatedAt
    - Job recruitment posting entity

18. **Resume** (`domain.resume.entity`)
    - Fields: ResumeId, Account, ResumeTitle, ResumeContent, StartedAt, EndedAt
    - Resume/career history entity

19. **Streak** (`domain.streak.entity`)
    - Fields: Account, Count, UpdatedAt
    - User activity streak tracking

## Key Principles Applied

✅ **Pure Java**: No Spring/JPA annotations or imports
✅ **VO Pattern**: All fields are Value Objects (Java records)
✅ **Convention**: "domain 모듈에는 model(Entity)과 VO만 둔다. 도메인 로직은 필요해질 때까지 application에 둔다."
✅ **Immutability**: All entities use `final` fields and `@Builder`
✅ **Type Safety**: Each field wrapped in a specific VO type

## Example Structure

```java
@Getter
@Builder
public class EntityName {
    private final EntityId id;
    private final RelatedEntity relatedEntity;
    private final FieldName fieldName;
    
    public record EntityId(Long value) {}
    public record FieldName(String value) {}
}
```

## Directory Structure

```
back/domain/src/main/java/com/b205/ozazak/domain/
├── account/entity/
│   └── Account.java
├── activity/entity/
│   └── Activity.java
├── block/entity/
│   ├── Block.java
│   └── BlockCategory.java
├── bookmark/entity/
│   └── Bookmark.java
├── comment/entity/
│   └── Comment.java
├── community/entity/
│   ├── Community.java
│   └── CommunityTag.java
├── company/entity/
│   └── Company.java
├── coverletter/entity/
│   └── Coverletter.java
├── essay/entity/
│   └── Essay.java
├── follow/entity/
│   └── Follow.java
├── project/entity/
│   ├── Project.java
│   └── ProjectTag.java
├── question/entity/
│   └── Question.java
├── reaction/entity/
│   └── Reaction.java
├── recruitment/entity/
│   └── Recruitment.java
├── resume/entity/
│   └── Resume.java
└── streak/entity/
    └── Streak.java
```

## Next Steps

To implement the full application layer for these entities:
1. Create port interfaces (in/out) for each entity
2. Create use case services
3. Create DTOs for data transfer
4. Implement JPA entities in infra layer
5. Implement adapters in infra layer
