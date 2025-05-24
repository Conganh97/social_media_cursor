package com.socialmedia.modules.file.controller;

import com.socialmedia.modules.file.dto.FileUploadResponse;
import com.socialmedia.modules.file.service.FileStorageService;
import com.socialmedia.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "File Management", description = "APIs for file upload, download, and management including image processing and thumbnails")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    @Operation(
        summary = "Upload File",
        description = "Upload a file to the specified directory path. Supports various file types with size validation and automatic thumbnail generation for images."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "File uploaded successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FileUploadResponse.class),
                examples = @ExampleObject(
                    name = "Upload Success",
                    value = """
                        {
                          "fileName": "uuid-123-document.pdf",
                          "fileDownloadUri": "/api/files/download/uuid-123-document.pdf",
                          "fileType": "application/pdf",
                          "size": 2048576,
                          "uploadPath": "general"
                        }"""
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid file or upload path",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "File type not supported"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "413", description = "File size exceeds maximum limit"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @Parameter(
                description = "File to upload (supports PDF, DOC, TXT, etc.)",
                required = true
            )
            @RequestParam("file") MultipartFile file,
            @Parameter(
                description = "Upload directory path",
                example = "general",
                schema = @Schema(allowableValues = {"general", "documents", "temp"})
            )
            @RequestParam(value = "uploadPath", defaultValue = "general") String uploadPath,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storeFile(file, 
                fileStorageService.getAllowedFileTypes().contains("uploadPath") ? uploadPath : "general", 
                currentUser.getId());
        
        log.info("File uploaded successfully: {} by user ID: {}", response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Upload Profile Image",
        description = "Upload a profile image for the authenticated user. Automatically generates thumbnails and validates image format."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Profile image uploaded successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FileUploadResponse.class),
                examples = @ExampleObject(
                    name = "Profile Image Upload Success",
                    value = """
                        {
                          "fileName": "uuid-456-profile.jpg",
                          "fileDownloadUri": "/api/files/profiles/uuid-456-profile.jpg",
                          "fileType": "image/jpeg",
                          "size": 1024000,
                          "uploadPath": "profiles",
                          "thumbnailUri": "/api/files/thumbnails/thumb-uuid-456-profile.jpg"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid image file format"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "413", description = "Image size exceeds limit"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/upload/profile-image")
    public ResponseEntity<FileUploadResponse> uploadProfileImage(
            @Parameter(
                description = "Profile image file (JPG, PNG, GIF supported)",
                required = true
            )
            @RequestParam("file") MultipartFile file,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storeProfileImage(file, currentUser.getId());
        
        log.info("Profile image uploaded successfully: {} by user ID: {}", 
                response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Upload Post Image",
        description = "Upload an image to be used in a post. Supports multiple image formats with automatic optimization."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Post image uploaded successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = FileUploadResponse.class),
                examples = @ExampleObject(
                    name = "Post Image Upload Success",
                    value = """
                        {
                          "fileName": "uuid-789-post.png",
                          "fileDownloadUri": "/api/files/posts/uuid-789-post.png",
                          "fileType": "image/png",
                          "size": 2048000,
                          "uploadPath": "posts",
                          "thumbnailUri": "/api/files/thumbnails/thumb-uuid-789-post.png"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid image file"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "413", description = "Image size exceeds limit"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/upload/post-image")
    public ResponseEntity<FileUploadResponse> uploadPostImage(
            @Parameter(
                description = "Post image file (JPG, PNG, GIF, WebP supported)",
                required = true
            )
            @RequestParam("file") MultipartFile file,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        FileUploadResponse response = fileStorageService.storePostImage(file, currentUser.getId());
        
        log.info("Post image uploaded successfully: {} by user ID: {}", 
                response.getFileName(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Download File",
        description = "Download a file by filename from the specified directory path. Returns the file as a binary stream."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "File downloaded successfully",
            content = @Content(mediaType = "application/octet-stream")
        ),
        @ApiResponse(
            responseCode = "404",
            description = "File not found",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "timestamp": "2024-01-01T12:00:00Z",
                          "status": 404,
                          "error": "Not Found",
                          "message": "File not found: document.pdf"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(
            @Parameter(
                description = "Name of the file to download",
                required = true,
                example = "uuid-123-document.pdf"
            )
            @PathVariable String fileName,
            @Parameter(
                description = "File directory path",
                example = "general",
                schema = @Schema(allowableValues = {"general", "documents", "temp"})
            )
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

    @Operation(
        summary = "Get Profile Image",
        description = "Retrieve a profile image by filename. Returns the image file for display in web browsers."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Profile image retrieved successfully",
            content = @Content(mediaType = "image/*")
        ),
        @ApiResponse(responseCode = "404", description = "Profile image not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/profiles/{fileName:.+}")
    public ResponseEntity<Resource> getProfileImage(
            @Parameter(
                description = "Profile image filename",
                required = true,
                example = "uuid-456-profile.jpg"
            )
            @PathVariable String fileName, 
            HttpServletRequest request) {
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

    @Operation(
        summary = "Get Post Image",
        description = "Retrieve a post image by filename. Returns the optimized image file for web display."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Post image retrieved successfully",
            content = @Content(mediaType = "image/*")
        ),
        @ApiResponse(responseCode = "404", description = "Post image not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/posts/{fileName:.+}")
    public ResponseEntity<Resource> getPostImage(
            @Parameter(
                description = "Post image filename",
                required = true,
                example = "uuid-789-post.png"
            )
            @PathVariable String fileName, 
            HttpServletRequest request) {
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

    @Operation(
        summary = "Get Thumbnail Image",
        description = "Retrieve a thumbnail version of an image. Thumbnails are automatically generated for uploaded images."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Thumbnail retrieved successfully",
            content = @Content(mediaType = "image/*")
        ),
        @ApiResponse(responseCode = "404", description = "Thumbnail not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/thumbnails/{fileName:.+}")
    public ResponseEntity<Resource> getThumbnail(
            @Parameter(
                description = "Thumbnail filename",
                required = true,
                example = "thumb-uuid-789-post.jpg"
            )
            @PathVariable String fileName, 
            HttpServletRequest request) {
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

    @Operation(
        summary = "Delete File",
        description = "Delete a file by filename from the specified directory. Only the file owner can delete their files."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "File deleted successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "File deleted successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "File not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/delete/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @Parameter(
                description = "Name of the file to delete",
                required = true,
                example = "uuid-123-document.pdf"
            )
            @PathVariable String fileName,
            @Parameter(
                description = "File directory path",
                example = "general"
            )
            @RequestParam(value = "filePath", defaultValue = "general") String filePath,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deleteFile(fileName, filePath);
        
        log.info("File deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "File deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Delete Profile Image",
        description = "Delete a profile image by filename. Also removes associated thumbnails."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Profile image deleted successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Profile image deleted successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Profile image not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/delete/profile-image/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deleteProfileImage(
            @Parameter(
                description = "Profile image filename to delete",
                required = true,
                example = "uuid-456-profile.jpg"
            )
            @PathVariable String fileName,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deleteProfileImage(fileName);
        
        log.info("Profile image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile image deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Delete Post Image",
        description = "Delete a post image by filename. Also removes associated thumbnails and optimized versions."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Post image deleted successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Post image deleted successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Post image not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/delete/post-image/{fileName:.+}")
    public ResponseEntity<Map<String, String>> deletePostImage(
            @Parameter(
                description = "Post image filename to delete",
                required = true,
                example = "uuid-789-post.png"
            )
            @PathVariable String fileName,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.deletePostImage(fileName);
        
        log.info("Post image deleted successfully: {} by user ID: {}", fileName, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Post image deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get File Upload Information",
        description = "Retrieve system information about file upload constraints, supported file types, and available operations."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "File upload information retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Upload Info",
                    value = """
                        {
                          "allowedFileTypes": ["pdf", "doc", "docx", "txt", "csv"],
                          "allowedImageTypes": ["jpg", "jpeg", "png", "gif", "webp"],
                          "maxFileSize": "5MB",
                          "maxImageSize": "10MB",
                          "supportedOperations": ["upload", "download", "delete", "resize", "thumbnail"]
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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

    @Operation(
        summary = "Clean Up Temporary Files",
        description = "Remove temporary files from the system. This operation cleans up files older than the configured retention period."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Temporary files cleaned up successfully",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    value = """
                        {
                          "message": "Temporary files cleaned up successfully"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/cleanup")
    public ResponseEntity<Map<String, String>> cleanupTempFiles(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser) {
        fileStorageService.cleanupTempFiles();
        
        log.info("Temporary files cleanup initiated by user ID: {}", currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Temporary files cleaned up successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Check File Existence",
        description = "Verify if a file exists in the specified directory path without downloading it."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "File existence check completed",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "File Exists",
                    value = """
                        {
                          "fileName": "uuid-123-document.pdf",
                          "exists": true,
                          "filePath": "general"
                        }"""
                )
            )
        ),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/exists/{fileName:.+}")
    public ResponseEntity<Map<String, Object>> checkFileExists(
            @Parameter(
                description = "Filename to check existence",
                required = true,
                example = "uuid-123-document.pdf"
            )
            @PathVariable String fileName,
            @Parameter(
                description = "File directory path",
                example = "general"
            )
            @RequestParam(value = "filePath", defaultValue = "general") String filePath) {
        boolean exists = fileStorageService.fileExists(fileName, filePath);
        
        Map<String, Object> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("exists", exists);
        response.put("filePath", filePath);
        
        return ResponseEntity.ok(response);
    }
} 