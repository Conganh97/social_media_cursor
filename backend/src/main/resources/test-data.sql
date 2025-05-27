-- Additional Test Data for Social Media Application
-- This file contains extra mock data that can be loaded manually if needed

-- Additional test users (beyond the 5 created by DataInitializer)
INSERT INTO users (username, email, password, first_name, last_name, bio, active, created_at, updated_at) VALUES
('sarah_m', 'sarah.m@example.com', '$2a$10$example_encoded_password', 'Sarah', 'Martinez', 'Product Manager | Agile enthusiast | Building user-centric products', true, NOW(), NOW()),
('alex_k', 'alex.k@example.com', '$2a$10$example_encoded_password', 'Alex', 'Kim', 'Data Scientist | Machine Learning engineer | Python & R expert', true, NOW(), NOW()),
('maria_r', 'maria.r@example.com', '$2a$10$example_encoded_password', 'Maria', 'Rodriguez', 'QA Engineer | Automation testing specialist | Ensuring software quality', true, NOW(), NOW()),
('john_d', 'john.d@example.com', '$2a$10$example_encoded_password', 'John', 'Davis', 'Security Engineer | Cybersecurity expert | Protecting digital assets', true, NOW(), NOW()),
('emma_w', 'emma.w@example.com', '$2a$10$example_encoded_password', 'Emma', 'Wilson', 'Mobile Developer | Flutter & React Native | Cross-platform apps', true, NOW(), NOW());

-- Sample additional posts (assuming user IDs 6-10 for the additional users)
INSERT INTO posts (content, user_id, created_at, updated_at) VALUES
('Product roadmap for Q2 is ready! Excited about the new features coming up 📋 #ProductManagement #Roadmap', 6, NOW(), NOW()),
('Just deployed a machine learning model that predicts user behavior with 95% accuracy! 🤖 #MachineLearning #DataScience', 7, NOW(), NOW()),
('Automated testing coverage reached 98%! Quality is our top priority 🎯 #QA #Testing #Quality', 8, NOW(), NOW()),
('Implemented zero-trust security architecture. Security should be built-in, not bolted-on 🔒 #Security #ZeroTrust', 9, NOW(), NOW()),
('Flutter app performance optimization complete. 60fps on all devices! 📱 #Flutter #MobileDev #Performance', 10, NOW(), NOW()),
('Great team retrospective today. Continuous improvement is the key to success! 🚀 #Agile #TeamWork', 6, NOW(), NOW()),
('Data visualization dashboard is live. Beautiful insights from complex datasets 📊 #DataViz #Analytics', 7, NOW(), NOW()),
('Bug detection rate improved by 40% with new testing strategy! 🐛 #BugHunting #QualityAssurance', 8, NOW(), NOW());

-- Sample friendship connections for additional users
INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES
(1, 6, 'ACCEPTED', NOW()),
(2, 7, 'ACCEPTED', NOW()),
(3, 8, 'PENDING', NOW()),
(4, 9, 'ACCEPTED', NOW()),
(5, 10, 'ACCEPTED', NOW()),
(6, 7, 'ACCEPTED', NOW()),
(8, 9, 'ACCEPTED', NOW()),
(9, 10, 'PENDING', NOW());

-- Sample messages between additional users
INSERT INTO messages (content, sender_id, receiver_id, read_status, created_at) VALUES
('The product roadmap looks great! When do we start the implementation?', 2, 6, false, NOW()),
('Can you help review the ML model performance metrics?', 7, 1, true, NOW()),
('Found some edge cases in the login flow. Let me know when you have time to discuss.', 8, 2, false, NOW()),
('Security audit completed. Everything looks good!', 9, 1, true, NOW()),
('The mobile app performance improvements are impressive!', 10, 5, false, NOW()),
('Team sync meeting scheduled for tomorrow at 10 AM', 6, 1, true, NOW()),
('Data pipeline optimization reduced processing time by 50%', 7, 3, false, NOW()),
('Regression test suite updated with new test cases', 8, 6, true, NOW());

-- Sample notifications for additional scenarios
INSERT INTO notifications (user_id, type, content, related_id, read_status, created_at) VALUES
(6, 'FRIEND_ACCEPTED', 'Công Anh accepted your friend request', 1, false, NOW()),
(7, 'LIKE', 'Sarah liked your post about machine learning', 12, true, NOW()),
(8, 'COMMENT', 'Alex commented on your post about testing coverage', 13, false, NOW()),
(9, 'MESSAGE', 'You have a new message from Linh', 4, true, NOW()),
(10, 'FRIEND_REQUEST', 'Đức sent you a friend request', 5, false, NOW()),
(1, 'LIKE', 'Sarah liked your post about team collaboration', 6, true, NOW()),
(2, 'MESSAGE', 'You have a new message from Sarah', 6, false, NOW()),
(3, 'FRIEND_REQUEST', 'Maria sent you a friend request', 8, true, NOW());

-- Sample comments on additional posts
INSERT INTO comments (content, post_id, user_id, created_at) VALUES
('Love the roadmap structure! Very clear priorities.', 9, 1, NOW()),
('Machine learning accuracy is impressive! What algorithm did you use?', 10, 3, NOW()),
('98% coverage is fantastic! What tools are you using for automation?', 11, 2, NOW()),
('Zero-trust is the way to go. Great implementation!', 12, 1, NOW()),
('Flutter performance optimization tips would be helpful!', 13, 4, NOW()),
('Retrospectives are so valuable for team growth', 14, 5, NOW()),
('Data visualization makes complex data so accessible', 15, 1, NOW()),
('Bug detection improvement is remarkable!', 16, 3, NOW());

-- Sample likes for additional posts and cross-user interactions
INSERT INTO likes (post_id, user_id, created_at) VALUES
(9, 1, NOW()), (9, 2, NOW()), (9, 3, NOW()),
(10, 1, NOW()), (10, 4, NOW()), (10, 5, NOW()),
(11, 2, NOW()), (11, 6, NOW()), (11, 7, NOW()),
(12, 1, NOW()), (12, 3, NOW()), (12, 4, NOW()),
(13, 2, NOW()), (13, 5, NOW()), (13, 6, NOW()),
(14, 1, NOW()), (14, 7, NOW()), (14, 8, NOW()),
(15, 3, NOW()), (15, 4, NOW()), (15, 9, NOW()),
(16, 5, NOW()), (16, 6, NOW()), (16, 10, NOW());

-- Additional friendship status variations
INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES
(7, 8, 'DECLINED', NOW()),
(8, 10, 'BLOCKED', NOW()),
(6, 9, 'PENDING', NOW()),
(10, 6, 'PENDING', NOW());

COMMIT; 