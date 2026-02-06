You are working on a Spring Boot multi-module project using Hexagonal Architecture.
Please follow the conventions below strictly.

========================
Architecture & Layering
========================
Modules:
- presentation
- application
- domain
- infra

Dependency direction:
presentation → application → domain
infra → application / domain
(No reverse dependencies)

JPA entities must NEVER leak outside infra.
Controllers must NEVER see JPA entities or repositories.

========================
Validation Rules
========================
1) Presentation Layer
- Responsibility: API contract validation
- Use Bean Validation only (@NotNull, @NotBlank, @Size, etc.)
- Example:
  - tags: @NotNull List<String>
  - empty list is allowed
  - null is rejected (400 BAD_REQUEST)

2) Application Layer
- Responsibility: business rules / use-case validation
- Examples:
  - conditional rules (e.g., tags allowed only for TIL)
  - state-based rules
- Throw IllegalArgumentException / IllegalStateException or domain-specific exceptions

3) Domain Layer
- Responsibility: entity invariants only
- No silent normalization (fail fast)
- No application-specific rules
- Assume inputs are already validated

========================
DTO / Command / Result Rules
========================
1) Presentation DTO
- request DTO: HTTP input model
- response DTO: HTTP output model
- primitives only (NO Value Objects)

2) Application Command
- Input to a use case
- Represents user intent
- Primitives by default
- Located under: application/<domain>/command

3) Application Result DTO
- Output of a use case
- Used when:
  - READ use cases
  - WRITE use cases returning more than a simple ID
  - multi-channel reuse (REST, batch, admin, etc.)
- Located under: application/<domain>/result (or dto)
- Never return domain entities to presentation

Flow:
RequestDTO → Command → UseCase → Result DTO → ResponseDTO

========================
Mapping Rules
========================
- RequestDTO → Command mapping lives in presentation
  (controller or presentation mapper)
- Result DTO → ResponseDTO mapping lives in presentation
- Application must NOT depend on presentation DTOs

========================
Value Object (VO) Usage
========================
Rule of thumb:
- Use VO ONLY when a value has domain meaning, rules, or behavior.

Layer rules:
- Presentation: primitives only (NO VO)
- Application: primitives by default, VO only if domain meaning must be preserved
- Domain: VO is allowed and encouraged for true domain concepts

Do NOT create VO preemptively.
Start with primitives, promote to VO when rules appear.

========================
Error Handling Convention
========================
- Errors are grouped by domain:
  presentation/<domain>/error

Each domain defines:
- <Domain>ErrorCode (maps to HTTP reason strings)
- <Domain>Exception

GlobalExceptionHandler:
- Only maps exceptions → HTTP responses
- No domain-specific error definitions

Error response format (fixed):
{
  "code": "<HTTP_REASON>",
  "message": "<human readable>"
}

Standard mapping:
- IllegalArgumentException → 400 BAD_REQUEST
- MethodArgumentNotValidException → 400 BAD_REQUEST
- IllegalStateException → 409 CONFLICT
- DataIntegrityViolationException → 409 CONFLICT
- Exception → 500 INTERNAL_SERVER_ERROR

========================
Persistence Rules
========================
- Use @CreationTimestamp / auditing for timestamps
- Do NOT set time (now()) in domain
- Use EntityManager.getReference() for FK optimization if policy allows
- Rely on DB constraints for referential integrity unless explicitly required

========================
Summary
========================
- Presentation: HTTP concerns only
- Application: use-case orchestration
- Domain: business meaning and invariants
- Infra: persistence and external systems
- Command = input
- Result DTO = output
- VO only where domain meaning exists
