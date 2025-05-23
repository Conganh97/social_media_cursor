package com.socialmedia.modules.file.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadRequest {
    private String fileName;
    private String fileType;
    private Boolean resizeImage;
    private Integer targetWidth;
    private Integer targetHeight;
    private Boolean createThumbnail;
    private Integer thumbnailWidth;
    private Integer thumbnailHeight;
    private Boolean maintainAspectRatio;
    private String uploadPath;
} 