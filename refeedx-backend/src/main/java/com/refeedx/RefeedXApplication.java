package com.refeedx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // required by DonationExpiryScheduler
public class RefeedXApplication {

    public static void main(String[] args) {
        SpringApplication.run(RefeedXApplication.class, args);
    }
}
