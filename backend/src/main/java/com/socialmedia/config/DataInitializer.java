package com.socialmedia.config;

import com.socialmedia.modules.user.entity.User;
import com.socialmedia.modules.post.entity.Post;
import com.socialmedia.modules.social.entity.Comment;
import com.socialmedia.modules.social.entity.Like;
import com.socialmedia.modules.social.entity.Friendship;
import com.socialmedia.modules.messaging.entity.Message;
import com.socialmedia.modules.notification.entity.Notification;
import com.socialmedia.modules.user.repository.UserRepository;
import com.socialmedia.modules.post.repository.PostRepository;
import com.socialmedia.modules.social.repository.CommentRepository;
import com.socialmedia.modules.social.repository.LikeRepository;
import com.socialmedia.modules.social.repository.FriendshipRepository;
import com.socialmedia.modules.messaging.repository.MessageRepository;
import com.socialmedia.modules.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Creating comprehensive test data...");
            
            List<User> users = createTestUsers();
            List<Post> posts = createTestPosts(users);
            createTestComments(posts, users);
            createTestLikes(posts, users);
            createTestFriendships(users);
            createTestMessages(users);
            createTestNotifications(users, posts);
            
            logger.info("Comprehensive test data created successfully!");
        } else {
            logger.info("Database already contains {} users. Skipping test data initialization.", userRepository.count());
        }
    }

    private List<User> createTestUsers() {
        logger.info("Creating test users...");
        List<User> users = new ArrayList<>();

        User testUser1 = new User();
        testUser1.setUsername("anhbc");
        testUser1.setEmail("anhbc@example.com");
        testUser1.setPassword(passwordEncoder.encode("Anhbc123@"));
        testUser1.setFirstName("Công Anh");
        testUser1.setLastName("Bùi");
        testUser1.setBio("Software Engineering Manager | Full-stack developer specializing in React and Spring Boot");
        testUser1.setActive(true);
        users.add(userRepository.save(testUser1));

        User testUser2 = new User();
        testUser2.setUsername("hungbv");
        testUser2.setEmail("hungbv@example.com");
        testUser2.setPassword(passwordEncoder.encode("hungbv123"));
        testUser2.setFirstName("Hưng");
        testUser2.setLastName("Bùi Văn");
        testUser2.setBio("Frontend Developer | React, TypeScript enthusiast | Building modern web applications");
        testUser2.setActive(true);
        users.add(userRepository.save(testUser2));

        User testUser3 = new User();
        testUser3.setUsername("khoinq");
        testUser3.setEmail("khoinq@example.com");
        testUser3.setPassword(passwordEncoder.encode("khoinq123"));
        testUser3.setFirstName("Khôi");
        testUser3.setLastName("Nguyễn Quý");
        testUser3.setBio("Backend Developer | Java Spring Boot expert | Database optimization specialist");
        testUser3.setActive(true);
        users.add(userRepository.save(testUser3));

        User testUser4 = new User();
        testUser4.setUsername("linhnt");
        testUser4.setEmail("linhnt@example.com");
        testUser4.setPassword(passwordEncoder.encode("linhnt123"));
        testUser4.setFirstName("Linh");
        testUser4.setLastName("Nguyễn Thị");
        testUser4.setBio("UI/UX Designer | Material Design advocate | Creating beautiful user experiences");
        testUser4.setActive(true);
        users.add(userRepository.save(testUser4));

        User testUser5 = new User();
        testUser5.setUsername("ducph");
        testUser5.setEmail("ducph@example.com");
        testUser5.setPassword(passwordEncoder.encode("ducph123"));
        testUser5.setFirstName("Đức");
        testUser5.setLastName("Phạm Hoàng");
        testUser5.setBio("DevOps Engineer | Docker & Kubernetes expert | Cloud infrastructure specialist");
        testUser5.setActive(true);
        users.add(userRepository.save(testUser5));

        logger.info("Created {} test users", users.size());
        return users;
    }

    private List<Post> createTestPosts(List<User> users) {
        logger.info("Creating test posts...");
        List<Post> posts = new ArrayList<>();

        Post post1 = new Post();
        post1.setContent("Just finished implementing the social media backend with Spring Boot! 🚀 The modular architecture is working beautifully. #SpringBoot #Java #SoftwareEngineering");
        post1.setUser(users.get(0));
        posts.add(postRepository.save(post1));

        Post post2 = new Post();
        post2.setContent("Working on the frontend with React and TypeScript. The type safety is amazing! 💻 #React #TypeScript #Frontend");
        post2.setUser(users.get(1));
        posts.add(postRepository.save(post2));

        Post post3 = new Post();
        post3.setContent("Database optimization is an art. Just improved query performance by 300% with proper indexing! 📊 #Database #PostgreSQL #Performance");
        post3.setUser(users.get(2));
        posts.add(postRepository.save(post3));

        Post post4 = new Post();
        post4.setContent("Material UI makes building beautiful interfaces so much easier! The new design system is looking great 🎨 #MaterialUI #Design #UX");
        post4.setUser(users.get(3));
        posts.add(postRepository.save(post4));

        Post post5 = new Post();
        post5.setContent("Containerized the entire application stack with Docker. Deployment is now seamless! 🐳 #Docker #DevOps #Deployment");
        post5.setUser(users.get(4));
        posts.add(postRepository.save(post5));

        Post post6 = new Post();
        post6.setContent("Team collaboration is key to successful projects. Great to work with such talented developers! 👥 #Teamwork #SoftwareDevelopment");
        post6.setUser(users.get(0));
        posts.add(postRepository.save(post6));

        Post post7 = new Post();
        post7.setContent("Redux state management is powerful when implemented correctly. Clean architecture patterns for the win! 🏗️ #Redux #StateManagement #Architecture");
        post7.setUser(users.get(1));
        posts.add(postRepository.save(post7));

        Post post8 = new Post();
        post8.setContent("JWT authentication with refresh tokens implemented. Security is paramount in modern applications! 🔐 #Security #JWT #Authentication");
        post8.setUser(users.get(2));
        posts.add(postRepository.save(post8));

        logger.info("Created {} test posts", posts.size());
        return posts;
    }

    private void createTestComments(List<Post> posts, List<User> users) {
        logger.info("Creating test comments...");

        Comment comment1 = new Comment();
        comment1.setContent("Awesome work! The modular approach really pays off in the long run.");
        comment1.setPost(posts.get(0));
        comment1.setUser(users.get(1));
        commentRepository.save(comment1);

        Comment comment2 = new Comment();
        comment2.setContent("I'd love to see the architecture diagram. Can you share it?");
        comment2.setPost(posts.get(0));
        comment2.setUser(users.get(2));
        commentRepository.save(comment2);

        Comment comment3 = new Comment();
        comment3.setContent("TypeScript is indeed a game changer for large applications!");
        comment3.setPost(posts.get(1));
        comment3.setUser(users.get(0));
        commentRepository.save(comment3);

        Comment comment4 = new Comment();
        comment4.setContent("How did you handle the type definitions for the API responses?");
        comment4.setPost(posts.get(1));
        comment4.setUser(users.get(3));
        commentRepository.save(comment4);

        Comment comment5 = new Comment();
        comment5.setContent("That's impressive! What indexing strategy did you use?");
        comment5.setPost(posts.get(2));
        comment5.setUser(users.get(4));
        commentRepository.save(comment5);

        Comment comment6 = new Comment();
        comment6.setContent("Material UI v5 is fantastic! The sx prop makes styling so intuitive.");
        comment6.setPost(posts.get(3));
        comment6.setUser(users.get(1));
        commentRepository.save(comment6);

        Comment comment7 = new Comment();
        comment7.setContent("Docker Compose setup must be clean. Any performance tips?");
        comment7.setPost(posts.get(4));
        comment7.setUser(users.get(0));
        commentRepository.save(comment7);

        Comment comment8 = new Comment();
        comment8.setContent("Couldn't agree more! Great team makes all the difference.");
        comment8.setPost(posts.get(5));
        comment8.setUser(users.get(2));
        commentRepository.save(comment8);

        logger.info("Created test comments");
    }

    private void createTestLikes(List<Post> posts, List<User> users) {
        logger.info("Creating test likes...");

        for (int i = 0; i < posts.size(); i++) {
            Post post = posts.get(i);
            for (int j = 0; j < users.size(); j++) {
                if (i != j && (i + j) % 2 == 0) {
                    Like like = new Like();
                    like.setPost(post);
                    like.setUser(users.get(j));
                    likeRepository.save(like);
                }
            }
        }

        logger.info("Created test likes");
    }

    private void createTestFriendships(List<User> users) {
        logger.info("Creating test friendships...");

        Friendship friendship1 = new Friendship();
        friendship1.setRequester(users.get(0));
        friendship1.setAddressee(users.get(1));
        friendship1.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship1);

        Friendship friendship2 = new Friendship();
        friendship2.setRequester(users.get(0));
        friendship2.setAddressee(users.get(2));
        friendship2.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship2);

        Friendship friendship3 = new Friendship();
        friendship3.setRequester(users.get(1));
        friendship3.setAddressee(users.get(3));
        friendship3.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship3);

        Friendship friendship4 = new Friendship();
        friendship4.setRequester(users.get(2));
        friendship4.setAddressee(users.get(4));
        friendship4.setStatus(Friendship.FriendshipStatus.PENDING);
        friendshipRepository.save(friendship4);

        Friendship friendship5 = new Friendship();
        friendship5.setRequester(users.get(3));
        friendship5.setAddressee(users.get(4));
        friendship5.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship5);

        logger.info("Created test friendships");
    }

    private void createTestMessages(List<User> users) {
        logger.info("Creating test messages...");

        Message message1 = new Message();
        message1.setContent("Hey! How's the Spring Boot project going?");
        message1.setSender(users.get(1));
        message1.setReceiver(users.get(0));
        message1.setReadStatus(true);
        messageRepository.save(message1);

        Message message2 = new Message();
        message2.setContent("Going great! Just finished the authentication module. How's the frontend?");
        message2.setSender(users.get(0));
        message2.setReceiver(users.get(1));
        message2.setReadStatus(true);
        messageRepository.save(message2);

        Message message3 = new Message();
        message3.setContent("Frontend is coming along nicely. The Redux setup is clean!");
        message3.setSender(users.get(1));
        message3.setReceiver(users.get(0));
        message3.setReadStatus(false);
        messageRepository.save(message3);

        Message message4 = new Message();
        message4.setContent("Need help with the database optimization. Do you have time for a call?");
        message4.setSender(users.get(2));
        message4.setReceiver(users.get(0));
        message4.setReadStatus(false);
        messageRepository.save(message4);

        Message message5 = new Message();
        message5.setContent("The new UI mockups look amazing! When can we start implementation?");
        message5.setSender(users.get(3));
        message5.setReceiver(users.get(1));
        message5.setReadStatus(true);
        messageRepository.save(message5);

        Message message6 = new Message();
        message6.setContent("Docker deployment is ready. Should we schedule the demo?");
        message6.setSender(users.get(4));
        message6.setReceiver(users.get(0));
        message6.setReadStatus(false);
        messageRepository.save(message6);

        logger.info("Created test messages");
    }

    private void createTestNotifications(List<User> users, List<Post> posts) {
        logger.info("Creating test notifications...");

        Notification notification1 = new Notification();
        notification1.setUser(users.get(0));
        notification1.setType(Notification.NotificationType.LIKE);
        notification1.setContent("Hưng liked your post about Spring Boot implementation");
        notification1.setRelatedId(posts.get(0).getId());
        notification1.setReadStatus(false);
        notificationRepository.save(notification1);

        Notification notification2 = new Notification();
        notification2.setUser(users.get(0));
        notification2.setType(Notification.NotificationType.COMMENT);
        notification2.setContent("Khôi commented on your post: 'I'd love to see the architecture diagram'");
        notification2.setRelatedId(posts.get(0).getId());
        notification2.setReadStatus(false);
        notificationRepository.save(notification2);

        Notification notification3 = new Notification();
        notification3.setUser(users.get(1));
        notification3.setType(Notification.NotificationType.FRIEND_REQUEST);
        notification3.setContent("Linh sent you a friend request");
        notification3.setRelatedId(users.get(3).getId());
        notification3.setReadStatus(true);
        notificationRepository.save(notification3);

        Notification notification4 = new Notification();
        notification4.setUser(users.get(2));
        notification4.setType(Notification.NotificationType.MESSAGE);
        notification4.setContent("You have a new message from Công Anh");
        notification4.setRelatedId(users.get(0).getId());
        notification4.setReadStatus(false);
        notificationRepository.save(notification4);

        Notification notification5 = new Notification();
        notification5.setUser(users.get(3));
        notification5.setType(Notification.NotificationType.FRIEND_ACCEPTED);
        notification5.setContent("Hưng accepted your friend request");
        notification5.setRelatedId(users.get(1).getId());
        notification5.setReadStatus(true);
        notificationRepository.save(notification5);

        Notification notification6 = new Notification();
        notification6.setUser(users.get(4));
        notification6.setType(Notification.NotificationType.LIKE);
        notification6.setContent("Multiple people liked your post about Docker deployment");
        notification6.setRelatedId(posts.get(4).getId());
        notification6.setReadStatus(false);
        notificationRepository.save(notification6);

        logger.info("Created test notifications");
    }
} 