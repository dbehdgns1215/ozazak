FROM gradle:7.6-jdk21-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]