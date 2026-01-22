package com.b205.ozazak.infra.autoconfig;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@AutoConfiguration
@ComponentScan(basePackages = "com.b205.ozazak.infra")
@EntityScan(basePackages = "com.b205.ozazak.infra")
@EnableJpaRepositories(basePackages = "com.b205.ozazak.infra")
public class InfraAutoConfiguration {
}
