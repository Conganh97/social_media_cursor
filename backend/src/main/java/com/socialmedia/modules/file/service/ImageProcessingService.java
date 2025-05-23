package com.socialmedia.modules.file.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public interface ImageProcessingService {
    
    BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight, boolean maintainAspectRatio);
    
    BufferedImage createThumbnail(BufferedImage originalImage, int thumbnailWidth, int thumbnailHeight);
    
    BufferedImage cropImage(BufferedImage originalImage, int x, int y, int width, int height);
    
    BufferedImage rotateImage(BufferedImage originalImage, double degrees);
    
    String saveProcessedImage(BufferedImage processedImage, String outputPath, String format);
    
    BufferedImage loadImage(String imagePath) throws IOException;
    
    BufferedImage loadImage(File imageFile) throws IOException;
    
    boolean isValidImageFormat(String fileName);
    
    String getImageFormat(String fileName);
    
    int[] getImageDimensions(BufferedImage image);
    
    int[] getImageDimensions(String imagePath) throws IOException;
    
    long getImageFileSize(String imagePath);
    
    BufferedImage applyWatermark(BufferedImage originalImage, String watermarkText);
    
    BufferedImage enhanceImageQuality(BufferedImage originalImage);
    
    boolean validateImageDimensions(BufferedImage image, int maxWidth, int maxHeight);
    
    String optimizeImageForWeb(String inputPath, String outputPath, float quality) throws IOException;
} 