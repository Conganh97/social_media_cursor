package com.socialmedia.modules.file.service.impl;

import com.socialmedia.modules.file.config.FileStorageConfig;
import com.socialmedia.modules.file.dto.FileUploadResponse;
import com.socialmedia.modules.file.exception.FileStorageException;
import com.socialmedia.modules.file.exception.InvalidFileException;
import com.socialmedia.modules.file.service.FileStorageService;
import com.socialmedia.modules.file.service.ImageProcessingService;
import com.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final FileStorageConfig fileStorageConfig;
    private final ImageProcessingService imageProcessingService;
    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        createDirectoriesIfNotExist();
    }

    @Override
    public FileUploadResponse storeFile(MultipartFile file, String uploadPath, Long userId) {
        log.info("Storing file: {} for user ID: {} in path: {}", file.getOriginalFilename(), userId, uploadPath);

        validateFile(file);
        
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        String username = getUsernameById(userId);
        
        try {
            Path targetLocation = Paths.get(uploadPath).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = fileStorageConfig.getBaseUrl() + "/api/files/" + fileName;
            boolean isImage = isImageFile(file);
            String thumbnailUrl = null;
            Integer width = null;
            Integer height = null;

            if (isImage && fileStorageConfig.isEnableImageProcessing()) {
                try {
                    BufferedImage image = imageProcessingService.loadImage(targetLocation.toFile());
                    int[] dimensions = imageProcessingService.getImageDimensions(image);
                    width = dimensions[0];
                    height = dimensions[1];

                    if (fileStorageConfig.isEnableThumbnailGeneration()) {
                        BufferedImage thumbnail = imageProcessingService.createThumbnail(
                                image,
                                fileStorageConfig.getDefaultThumbnailWidth(),
                                fileStorageConfig.getDefaultThumbnailHeight()
                        );
                        String thumbnailFileName = "thumb_" + fileName;
                        String thumbnailPath = imageProcessingService.saveProcessedImage(
                                thumbnail,
                                fileStorageConfig.getFullThumbnailPath() + thumbnailFileName,
                                getImageFormat(fileName)
                        );
                        thumbnailUrl = fileStorageConfig.getBaseUrl() + "/api/files/thumbnails/" + thumbnailFileName;
                    }
                } catch (Exception e) {
                    log.warn("Failed to process image: {}", e.getMessage());
                }
            }

            FileUploadResponse response = new FileUploadResponse(
                    fileName,
                    file.getOriginalFilename(),
                    fileUrl,
                    file.getContentType(),
                    file.getSize(),
                    username,
                    LocalDateTime.now(),
                    isImage,
                    thumbnailUrl,
                    width,
                    height
            );

            log.info("File stored successfully: {}", fileName);
            return response;

        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage(), e);
            throw new FileStorageException("Could not store file " + fileName, e);
        }
    }

    @Override
    public FileUploadResponse storeProfileImage(MultipartFile file, Long userId) {
        log.info("Storing profile image for user ID: {}", userId);
        
        if (!validateImageFile(file)) {
            throw new InvalidFileException("Invalid image file");
        }
        
        return storeFile(file, fileStorageConfig.getFullProfileImagePath(), userId);
    }

    @Override
    public FileUploadResponse storePostImage(MultipartFile file, Long userId) {
        log.info("Storing post image for user ID: {}", userId);
        
        if (!validateImageFile(file)) {
            throw new InvalidFileException("Invalid image file");
        }
        
        return storeFile(file, fileStorageConfig.getFullPostImagePath(), userId);
    }

    @Override
    public Resource loadFileAsResource(String fileName, String filePath) {
        try {
            Path path = Paths.get(filePath).resolve(fileName).normalize();
            Resource resource = new UrlResource(path.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + fileName);
            }
        } catch (MalformedURLException e) {
            log.error("File path is malformed: {}", e.getMessage());
            throw new FileStorageException("File path is malformed: " + fileName, e);
        }
    }

    @Override
    public Resource loadProfileImageAsResource(String fileName) {
        return loadFileAsResource(fileName, fileStorageConfig.getFullProfileImagePath());
    }

    @Override
    public Resource loadPostImageAsResource(String fileName) {
        return loadFileAsResource(fileName, fileStorageConfig.getFullPostImagePath());
    }

    @Override
    public Resource loadThumbnailAsResource(String fileName) {
        return loadFileAsResource(fileName, fileStorageConfig.getFullThumbnailPath());
    }

    @Override
    public void deleteFile(String fileName, String filePath) {
        try {
            Path path = Paths.get(filePath).resolve(fileName).normalize();
            Files.deleteIfExists(path);
            log.info("File deleted: {}", fileName);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", e.getMessage(), e);
            throw new FileStorageException("Could not delete file: " + fileName, e);
        }
    }

    @Override
    public void deleteProfileImage(String fileName) {
        deleteFile(fileName, fileStorageConfig.getFullProfileImagePath());
        deleteThumbnail("thumb_" + fileName);
    }

    @Override
    public void deletePostImage(String fileName) {
        deleteFile(fileName, fileStorageConfig.getFullPostImagePath());
        deleteThumbnail("thumb_" + fileName);
    }

    @Override
    public void deleteThumbnail(String fileName) {
        deleteFile(fileName, fileStorageConfig.getFullThumbnailPath());
    }

    @Override
    public boolean fileExists(String fileName, String filePath) {
        Path path = Paths.get(filePath).resolve(fileName).normalize();
        return Files.exists(path);
    }

    @Override
    public boolean validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().contains("..")) {
            throw new InvalidFileException("Invalid file name");
        }

        if (file.getSize() > fileStorageConfig.getMaxFileSize()) {
            throw new InvalidFileException("File size exceeds maximum allowed size");
        }

        String contentType = file.getContentType();
        if (contentType == null || !fileStorageConfig.getAllowedFileTypes().contains(contentType)) {
            throw new InvalidFileException("File type not allowed: " + contentType);
        }

        return true;
    }

    @Override
    public boolean validateImageFile(MultipartFile file) {
        validateFile(file);

        if (file.getSize() > fileStorageConfig.getMaxImageSize()) {
            throw new InvalidFileException("Image size exceeds maximum allowed size");
        }

        String contentType = file.getContentType();
        if (!fileStorageConfig.getAllowedImageTypes().contains(contentType)) {
            throw new InvalidFileException("Image type not allowed: " + contentType);
        }

        return true;
    }

    @Override
    public String generateUniqueFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        return UUID.randomUUID().toString() + "." + extension;
    }

    @Override
    public String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    @Override
    public String getContentType(String fileName) {
        String extension = getFileExtension(fileName);
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "pdf" -> "application/pdf";
            case "txt" -> "text/plain";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> "application/octet-stream";
        };
    }

    @Override
    public Long getFileSize(MultipartFile file) {
        return file.getSize();
    }

    @Override
    public List<String> getAllowedFileTypes() {
        return fileStorageConfig.getAllowedFileTypes();
    }

    @Override
    public List<String> getAllowedImageTypes() {
        return fileStorageConfig.getAllowedImageTypes();
    }

    @Override
    public void createDirectoriesIfNotExist() {
        try {
            Files.createDirectories(Paths.get(fileStorageConfig.getFullUploadPath()));
            Files.createDirectories(Paths.get(fileStorageConfig.getFullProfileImagePath()));
            Files.createDirectories(Paths.get(fileStorageConfig.getFullPostImagePath()));
            Files.createDirectories(Paths.get(fileStorageConfig.getFullThumbnailPath()));
            Files.createDirectories(Paths.get(fileStorageConfig.getFullTempPath()));
            log.info("File storage directories created successfully");
        } catch (IOException e) {
            log.error("Failed to create file storage directories: {}", e.getMessage(), e);
            throw new FileStorageException("Could not create upload directories", e);
        }
    }

    @Override
    public void cleanupTempFiles() {
        try {
            Path tempPath = Paths.get(fileStorageConfig.getFullTempPath());
            if (Files.exists(tempPath)) {
                Files.walk(tempPath)
                        .filter(Files::isRegularFile)
                        .forEach(file -> {
                            try {
                                Files.delete(file);
                            } catch (IOException e) {
                                log.warn("Failed to delete temp file: {}", file.getFileName());
                            }
                        });
            }
            log.info("Temporary files cleaned up");
        } catch (IOException e) {
            log.error("Failed to cleanup temp files: {}", e.getMessage(), e);
        }
    }

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && fileStorageConfig.getAllowedImageTypes().contains(contentType);
    }

    private String getImageFormat(String fileName) {
        String extension = getFileExtension(fileName);
        return switch (extension) {
            case "jpg", "jpeg" -> "jpg";
            case "png" -> "png";
            case "gif" -> "gif";
            case "webp" -> "webp";
            default -> "jpg";
        };
    }

    private String getUsernameById(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getUsername())
                .orElse("unknown");
    }
} 