package com.medicore.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MediCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediCoreApplication.class, args);
    }
}
