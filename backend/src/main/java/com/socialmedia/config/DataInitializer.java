package com.socialmedia.config;

import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        initializeTestUsers();
    }

    private void initializeTestUsers() {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Creating test users...");

            // Create test user 1
            User testUser1 = new User();
            testUser1.setUsername("anhbc");
            testUser1.setEmail("anhbc@example.com");
            testUser1.setPassword(passwordEncoder.encode("anhbc123"));
            testUser1.setFirstName("Công Anh");
            testUser1.setLastName("Bùi");
            testUser1.setBio("This is a test user account");
            testUser1.setActive(true);
            userRepository.save(testUser1);

            // Create test user 2
            User testUser2 = new User();
            testUser2.setUsername("hungbv");
            testUser2.setEmail("hungbv@example.com");
            testUser2.setPassword(passwordEncoder.encode("hungbv123"));
            testUser2.setFirstName("Hưng");
            testUser2.setLastName("Bùi Văn");
            testUser2.setBio("This is a test user account");
            testUser2.setActive(true);
            userRepository.save(testUser2);

            // Create test user 3
            User testUser3 = new User();
            testUser3.setUsername("khoinq");
            testUser3.setEmail("khoinq@example.com");
            testUser3.setPassword(passwordEncoder.encode("khoinq123"));
            testUser3.setFirstName("Khôi");
            testUser3.setLastName("Nguyễn Quý");
            testUser3.setBio("Software developer and tech enthusiast");
            testUser3.setActive(true);
            userRepository.save(testUser3);

            logger.info("Test users created successfully.");
        } else {
            logger.info("Database already contains {} users. Skipping test data initialization.", userRepository.count());
        }
    }
} 