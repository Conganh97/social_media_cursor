package com.socialmedia.modules.file.controller;

import com.socialmedia.modules.file.dto.FileUploadResponse;
import com.socialmedia.modules.file.exception.FileStorageException;
import com.socialmedia.modules.file.exception.InvalidFileException;
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
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uploadPath", defaultValue = "general") String uploadPath,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            FileUploadResponse response = fileStorageService.storeFile(file, 
                    fileStorageService.getAllowedFileTypes().contains("uploadPath") ? uploadPath : "general", 
                    currentUser.getId());
            
            log.info("File uploaded successfully: {} by user ID: {}", response.getFileName(), currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (InvalidFileException e) {
            log.error("Invalid file upload attempt: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid file", e.getMessage()));
        } catch (FileStorageException e) {
            log.error("File storage error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Storage error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Upload failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/upload/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            FileUploadResponse response = fileStorageService.storeProfileImage(file, currentUser.getId());
            
            log.info("Profile image uploaded successfully: {} by user ID: {}", 
                    response.getFileName(), currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (InvalidFileException e) {
            log.error("Invalid profile image upload attempt: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid image file", e.getMessage()));
        } catch (FileStorageException e) {
            log.error("Profile image storage error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Storage error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during profile image upload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Upload failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/upload/post-image")
    public ResponseEntity<?> uploadPostImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            FileUploadResponse response = fileStorageService.storePostImage(file, currentUser.getId());
            
            log.info("Post image uploaded successfully: {} by user ID: {}", 
                    response.getFileName(), currentUser.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (InvalidFileException e) {
            log.error("Invalid post image upload attempt: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid image file", e.getMessage()));
        } catch (FileStorageException e) {
            log.error("Post image storage error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Storage error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during post image upload: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Upload failed", "An unexpected error occurred"));
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<?> downloadFile(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath,
            HttpServletRequest request) {
        try {
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
        } catch (FileStorageException e) {
            log.error("File download error: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error during file download: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Download failed", "An unexpected error occurred"));
        }
    }

    @GetMapping("/profiles/{fileName:.+}")
    public ResponseEntity<?> getProfileImage(@PathVariable String fileName, HttpServletRequest request) {
        try {
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
        } catch (FileStorageException e) {
            log.error("Profile image download error: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error during profile image download: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/posts/{fileName:.+}")
    public ResponseEntity<?> getPostImage(@PathVariable String fileName, HttpServletRequest request) {
        try {
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
        } catch (FileStorageException e) {
            log.error("Post image download error: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error during post image download: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/thumbnails/{fileName:.+}")
    public ResponseEntity<?> getThumbnail(@PathVariable String fileName, HttpServletRequest request) {
        try {
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
        } catch (FileStorageException e) {
            log.error("Thumbnail download error: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error during thumbnail download: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{fileName:.+}")
    public ResponseEntity<?> deleteFile(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            fileStorageService.deleteFile(fileName, filePath);
            
            log.info("File deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("File deleted successfully"));
        } catch (FileStorageException e) {
            log.error("File deletion error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during file deletion: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", "An unexpected error occurred"));
        }
    }

    @DeleteMapping("/delete/profile-image/{fileName:.+}")
    public ResponseEntity<?> deleteProfileImage(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            fileStorageService.deleteProfileImage(fileName);
            
            log.info("Profile image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("Profile image deleted successfully"));
        } catch (FileStorageException e) {
            log.error("Profile image deletion error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during profile image deletion: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", "An unexpected error occurred"));
        }
    }

    @DeleteMapping("/delete/post-image/{fileName:.+}")
    public ResponseEntity<?> deletePostImage(
            @PathVariable String fileName,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            fileStorageService.deletePostImage(fileName);
            
            log.info("Post image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("Post image deleted successfully"));
        } catch (FileStorageException e) {
            log.error("Post image deletion error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during post image deletion: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Deletion failed", "An unexpected error occurred"));
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getFileUploadInfo() {
        try {
            Map<String, Object> info = new HashMap<>();
            info.put("allowedFileTypes", fileStorageService.getAllowedFileTypes());
            info.put("allowedImageTypes", fileStorageService.getAllowedImageTypes());
            info.put("maxFileSize", "5MB");
            info.put("maxImageSize", "10MB");
            info.put("supportedOperations", List.of("upload", "download", "delete", "resize", "thumbnail"));
            
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            log.error("Error retrieving file upload info: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Info retrieval failed", "An unexpected error occurred"));
        }
    }

    @PostMapping("/cleanup")
    public ResponseEntity<?> cleanupTempFiles(@AuthenticationPrincipal UserPrincipal currentUser) {
        try {
            fileStorageService.cleanupTempFiles();
            
            log.info("Temporary files cleanup initiated by user ID: {}", currentUser.getId());
            return ResponseEntity.ok(createSuccessResponse("Temporary files cleaned up successfully"));
        } catch (Exception e) {
            log.error("Error during temp files cleanup: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Cleanup failed", "An unexpected error occurred"));
        }
    }

    @GetMapping("/exists/{fileName:.+}")
    public ResponseEntity<?> checkFileExists(
            @PathVariable String fileName,
            @RequestParam(value = "filePath", defaultValue = "general") String filePath) {
        try {
            boolean exists = fileStorageService.fileExists(fileName, filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("exists", exists);
            response.put("filePath", filePath);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking file existence: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Check failed", "An unexpected error occurred"));
        }
    }

    private Map<String, Object> createErrorResponse(String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
} 