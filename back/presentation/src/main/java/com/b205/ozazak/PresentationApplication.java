package com.b205.ozazak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.github.cdimascio.dotenv.Dotenv;
import java.io.File;

@SpringBootApplication
@EnableScheduling
public class PresentationApplication {
    public static void main(String[] args) {

        // 로컬 개발일 때만 .env 파일을 읽어서 환경변수 설정
        try {
            String currentDir = System.getProperty("user.dir");
            // 로컬 경로에 맞춰서 파일 객체 생성
            File envFile = new File(currentDir + "/back/.env");

            if (envFile.exists()) {
                Dotenv dotenv = Dotenv.configure()
                        .directory(currentDir + "/back")
                        .ignoreIfMissing()
                        .load();

                dotenv.entries().forEach(entry -> {
                    System.setProperty(entry.getKey(), entry.getValue());
                });
            } else {
            }
        } catch (Exception e) {

        }

        SpringApplication.run(PresentationApplication.class, args);
    }
}