package com.socialmedia.modules.file.controller;

import com.socialmedia.modules.file.dto.FileUploadResponse;
import com.socialmedia.modules.file.service.FileStorageService;
import com.socialmedia.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uploadPath", defaultValue = "general") String uploadPath,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storeFile(file, 
                fileStorageService.getAllowedFileTypes().contains("uploadPath") ? uploadPath : "general", 
                currentUser.getId());
        
        log.info("File uploaded successfully: {} by user ID: {}", response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/upload/profile-image")
    public ResponseEntity<FileUploadResponse> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storeProfileImage(file, currentUser.getId());
        
        log.info("Profile image uploaded successfully: {} by user ID: {}", 
                response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/upload/post-image")
    public ResponseEntity<FileUploadResponse> uploadPostImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storePostImage(file, currentUser.getId());
        
        log.info("Post image uploaded successfully: {} by user ID: {}", 
                response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath,
            HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(fileName, filePath);
        
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.info("Could not determine file type for: {}", fileName);
        }

        if (contentType == null) {
            contentType = fileStorageService.getContentType(fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @GetMapping("/profiles/{fileName:.+}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadProfileImageAsResource(fileName);
        
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.info("Could not determine file type for profile image: {}", fileName);
        }

        if (contentType == null) {
            contentType = fileStorageService.getContentType(fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/posts/{fileName:.+}")
    public ResponseEntity<Resource> getPostImage(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadPostImageAsResource(fileName);
        
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.info("Could not determine file type for post image: {}", fileName);
        }

        if (contentType == null) {
            contentType = fileStorageService.getContentType(fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/thumbnails/{fileName:.+}")
    public ResponseEntity<Resource> getThumbnail(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileStorageService.loadThumbnailAsResource(fileName);
        
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.info("Could not determine file type for thumbnail: {}", fileName);
        }

        if (contentType == null) {
            contentType = fileStorageService.getContentType(fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @DeleteMapping("/delete/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deleteFile(fileName, filePath);
        
        log.info("File deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "File deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/profile-image/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteProfileImage(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deleteProfileImage(fileName);
        
        log.info("Profile image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile image deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/post-image/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deletePostImage(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deletePostImage(fileName);
        
        log.info("Post image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Post image deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getFileUploadInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("allowedFileTypes", fileStorageService.getAllowedFileTypes());
        info.put("allowedImageTypes", fileStorageService.getAllowedImageTypes());
        info.put("maxFileSize", "5MB");
        info.put("maxImageSize", "10MB");
        info.put("supportedOperations", List.of("upload", "download", "delete", "resize", "thumbnail"));
        
        return ResponseEntity.ok(info);
    }

    @PostMapping("/cleanup")
    public ResponseEntity<Map<String, String>> cleanupTempFiles(@AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.cleanupTempFiles();
        
        log.info("Temporary files cleanup initiated by user ID: {}", currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Temporary files cleaned up successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{fileName:.+}")
    public ResponseEntity<Map<String, Object>> checkFileExists(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath) {
        boolean exists = fileStorageService.fileExists(fileName, filePath);
        
        Map<String, Object> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("exists", exists);
        response.put("filePath", filePath);
        
        return ResponseEntity.ok(response);
    }
} 