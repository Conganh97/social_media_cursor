package com.socialmedia.modules.file.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "file.storage")
@Data
public class FileStorageConfig {
    
    private String uploadDir = "uploads/";
    private String profileImageDir = "uploads/profiles/";
    private String postImageDir = "uploads/posts/";
    private String thumbnailDir = "uploads/thumbnails/";
    
    private Long maxFileSize = 5242880L; // 5MB
    private Long maxImageSize = 10485760L; // 10MB
    
    private List<String> allowedFileTypes = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    
    private List<String> allowedImageTypes = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    
    private String baseUrl = "http://localhost:8080";
    
    private boolean enableImageProcessing = true;
    private boolean enableThumbnailGeneration = true;
    
    private Integer defaultThumbnailWidth = 150;
    private Integer defaultThumbnailHeight = 150;
    
    private Integer maxImageWidth = 1920;
    private Integer maxImageHeight = 1080;
    
    private String tempDir = "temp/";
    
    public String getFullUploadPath() {
        return System.getProperty("user.dir") + "/" + uploadDir;
    }
    
    public String getFullProfileImagePath() {
        return System.getProperty("user.dir") + "/" + profileImageDir;
    }
    
    public String getFullPostImagePath() {
        return System.getProperty("user.dir") + "/" + postImageDir;
    }
    
    public String getFullThumbnailPath() {
        return System.getProperty("user.dir") + "/" + thumbnailDir;
    }
    
    public String getFullTempPath() {
        return System.getProperty("user.dir") + "/" + tempDir;
    }
} 