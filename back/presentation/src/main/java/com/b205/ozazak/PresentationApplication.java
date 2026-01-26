package com.b205.ozazak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;

@SpringBootApplication
public class PresentationApplication {
    public static void main(String[] args) {

        // 1. 현재 실행 경로 확인
        String currentDir = System.getProperty("user.dir");
        File envFile = new File(currentDir + "/back/.env");
        try {
            // Dotenv 로드 시도 (ignoreIfMissing 제거하여 에러 유발)
            Dotenv dotenv = Dotenv.configure()
                    .directory("./back")
                    .load();
            // 로드된 값 시스템에 주입
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
            });
        } catch (Exception e) {
            return;
        }
        SpringApplication.run(PresentationApplication.class, args);
    }
}