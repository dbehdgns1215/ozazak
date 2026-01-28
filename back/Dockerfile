FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY . .
RUN tr -d '\r' < gradlew > gradlew.lf && mv gradlew.lf gradlew && chmod +x gradlew
# 기존: RUN ./gradlew :presentation:bootJar --no-daemon
# 변경:
RUN gradle :presentation:bootJar --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/presentation/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
