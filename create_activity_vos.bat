@echo off
REM Script to create all VO files for remaining domains

REM Activity VOs
echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityId.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityId.java
echo public record ActivityId(Long value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityId.java

echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityTitle.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityTitle.java
echo public record ActivityTitle(String value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityTitle.java

echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityCode.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityCode.java
echo public record ActivityCode(Integer value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\ActivityCode.java

echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\RankName.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\RankName.java
echo public record RankName(String value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\RankName.java

echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\Organization.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\Organization.java
echo public record Organization(String value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\Organization.java

echo package com.b205.ozazak.domain.activity.vo; > back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\AwardedAt.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\AwardedAt.java
echo import java.time.LocalDate; >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\AwardedAt.java
echo. >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\AwardedAt.java
echo public record AwardedAt(LocalDate value) {} >> back\domain\src\main\java\com\b205\ozazak\domain\activity\vo\AwardedAt.java

echo All Activity VOs created successfully!
