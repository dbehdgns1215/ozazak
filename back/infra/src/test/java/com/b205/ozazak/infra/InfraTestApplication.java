package com.b205.ozazak.infra;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Test-only Spring Boot Application configuration for infra module tests.
 * This class is required because @DataJpaTest needs a @SpringBootConfiguration
 * to bootstrap the test context, but the infra module doesn't have a main application.
 */
@SpringBootApplication
public class InfraTestApplication {
}
