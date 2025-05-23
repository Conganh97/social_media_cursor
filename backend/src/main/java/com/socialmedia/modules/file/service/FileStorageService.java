package com.socialmedia.modules.file.service;

import com.socialmedia.modules.file.dto.FileUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {
    
    FileUploadResponse storeFile(MultipartFile file, String uploadPath, Long userId);
    
    FileUploadResponse storeProfileImage(MultipartFile file, Long userId);
    
    FileUploadResponse storePostImage(MultipartFile file, Long userId);
    
    Resource loadFileAsResource(String fileName, String filePath);
    
    Resource loadProfileImageAsResource(String fileName);
    
    Resource loadPostImageAsResource(String fileName);
    
    Resource loadThumbnailAsResource(String fileName);
    
    void deleteFile(String fileName, String filePath);
    
    void deleteProfileImage(String fileName);
    
    void deletePostImage(String fileName);
    
    void deleteThumbnail(String fileName);
    
    boolean fileExists(String fileName, String filePath);
    
    boolean validateFile(MultipartFile file);
    
    boolean validateImageFile(MultipartFile file);
    
    String generateUniqueFileName(String originalFileName);
    
    String getFileExtension(String fileName);
    
    String getContentType(String fileName);
    
    Long getFileSize(MultipartFile file);
    
    List<String> getAllowedFileTypes();
    
    List<String> getAllowedImageTypes();
    
    void createDirectoriesIfNotExist();
    
    void cleanupTempFiles();
} 