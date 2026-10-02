package com.medicore.hms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MediCoreApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void printBcrypt() {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        System.out.println("BCRYPT_HASH_ADMIN123: " + encoder.encode("admin123"));
    }
}
