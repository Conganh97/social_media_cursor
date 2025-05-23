package com.socialmedia.modules.file.service.impl;

import com.socialmedia.modules.file.service.ImageProcessingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class ImageProcessingServiceImpl implements ImageProcessingService {

    private static final List<String> SUPPORTED_FORMATS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");

    @Override
    public BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight, boolean maintainAspectRatio) {
        log.info("Resizing image from {}x{} to {}x{}", 
                originalImage.getWidth(), originalImage.getHeight(), targetWidth, targetHeight);

        int newWidth = targetWidth;
        int newHeight = targetHeight;

        if (maintainAspectRatio) {
            double aspectRatio = (double) originalImage.getWidth() / originalImage.getHeight();
            
            if (targetWidth / aspectRatio <= targetHeight) {
                newHeight = (int) (targetWidth / aspectRatio);
            } else {
                newWidth = (int) (targetHeight * aspectRatio);
            }
        }

        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        
        graphics.drawImage(originalImage, 0, 0, newWidth, newHeight, null);
        graphics.dispose();

        log.info("Image resized successfully to {}x{}", newWidth, newHeight);
        return resizedImage;
    }

    @Override
    public BufferedImage createThumbnail(BufferedImage originalImage, int thumbnailWidth, int thumbnailHeight) {
        log.info("Creating thumbnail {}x{} from image {}x{}", 
                thumbnailWidth, thumbnailHeight, originalImage.getWidth(), originalImage.getHeight());
        
        return resizeImage(originalImage, thumbnailWidth, thumbnailHeight, true);
    }

    @Override
    public BufferedImage cropImage(BufferedImage originalImage, int x, int y, int width, int height) {
        log.info("Cropping image from ({}, {}) with size {}x{}", x, y, width, height);

        int maxWidth = Math.min(width, originalImage.getWidth() - x);
        int maxHeight = Math.min(height, originalImage.getHeight() - y);

        if (x < 0 || y < 0 || x >= originalImage.getWidth() || y >= originalImage.getHeight()) {
            throw new IllegalArgumentException("Invalid crop coordinates");
        }

        BufferedImage croppedImage = originalImage.getSubimage(x, y, maxWidth, maxHeight);
        
        BufferedImage result = new BufferedImage(maxWidth, maxHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = result.createGraphics();
        graphics.drawImage(croppedImage, 0, 0, null);
        graphics.dispose();

        log.info("Image cropped successfully to {}x{}", maxWidth, maxHeight);
        return result;
    }

    @Override
    public BufferedImage rotateImage(BufferedImage originalImage, double degrees) {
        log.info("Rotating image by {} degrees", degrees);

        double radians = Math.toRadians(degrees);
        double sin = Math.abs(Math.sin(radians));
        double cos = Math.abs(Math.cos(radians));
        
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        
        int newWidth = (int) Math.floor(width * cos + height * sin);
        int newHeight = (int) Math.floor(height * cos + width * sin);

        BufferedImage rotatedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = rotatedImage.createGraphics();
        
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.translate((newWidth - width) / 2, (newHeight - height) / 2);
        graphics.rotate(radians, width / 2.0, height / 2.0);
        graphics.drawImage(originalImage, 0, 0, null);
        graphics.dispose();

        log.info("Image rotated successfully by {} degrees", degrees);
        return rotatedImage;
    }

    @Override
    public String saveProcessedImage(BufferedImage processedImage, String outputPath, String format) {
        try {
            File outputFile = new File(outputPath);
            outputFile.getParentFile().mkdirs();
            
            if (format.equalsIgnoreCase("jpg") || format.equalsIgnoreCase("jpeg")) {
                BufferedImage rgbImage = new BufferedImage(
                        processedImage.getWidth(), 
                        processedImage.getHeight(), 
                        BufferedImage.TYPE_INT_RGB
                );
                Graphics2D graphics = rgbImage.createGraphics();
                graphics.setColor(Color.WHITE);
                graphics.fillRect(0, 0, processedImage.getWidth(), processedImage.getHeight());
                graphics.drawImage(processedImage, 0, 0, null);
                graphics.dispose();
                processedImage = rgbImage;
            }
            
            ImageIO.write(processedImage, format, outputFile);
            log.info("Processed image saved to: {}", outputPath);
            return outputPath;
        } catch (IOException e) {
            log.error("Failed to save processed image: {}", e.getMessage(), e);
            throw new RuntimeException("Could not save processed image", e);
        }
    }

    @Override
    public BufferedImage loadImage(String imagePath) throws IOException {
        log.info("Loading image from path: {}", imagePath);
        File imageFile = new File(imagePath);
        return loadImage(imageFile);
    }

    @Override
    public BufferedImage loadImage(File imageFile) throws IOException {
        if (!imageFile.exists()) {
            throw new IOException("Image file not found: " + imageFile.getPath());
        }
        
        BufferedImage image = ImageIO.read(imageFile);
        if (image == null) {
            throw new IOException("Could not read image file: " + imageFile.getPath());
        }
        
        log.info("Image loaded successfully: {}x{}", image.getWidth(), image.getHeight());
        return image;
    }

    @Override
    public boolean isValidImageFormat(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return false;
        }
        
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return SUPPORTED_FORMATS.contains(extension);
    }

    @Override
    public String getImageFormat(String fileName) {
        if (!isValidImageFormat(fileName)) {
            return "jpg"; // default format
        }
        
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return extension.equals("jpeg") ? "jpg" : extension;
    }

    @Override
    public int[] getImageDimensions(BufferedImage image) {
        return new int[]{image.getWidth(), image.getHeight()};
    }

    @Override
    public int[] getImageDimensions(String imagePath) throws IOException {
        BufferedImage image = loadImage(imagePath);
        return getImageDimensions(image);
    }

    @Override
    public long getImageFileSize(String imagePath) {
        File file = new File(imagePath);
        return file.exists() ? file.length() : 0;
    }

    @Override
    public BufferedImage applyWatermark(BufferedImage originalImage, String watermarkText) {
        log.info("Applying watermark: {}", watermarkText);

        BufferedImage watermarkedImage = new BufferedImage(
                originalImage.getWidth(), 
                originalImage.getHeight(), 
                BufferedImage.TYPE_INT_RGB
        );
        
        Graphics2D graphics = watermarkedImage.createGraphics();
        graphics.drawImage(originalImage, 0, 0, null);
        
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics.setFont(new Font("Arial", Font.BOLD, 24));
        graphics.setColor(new Color(255, 255, 255, 128)); // Semi-transparent white
        
        FontMetrics fontMetrics = graphics.getFontMetrics();
        int textWidth = fontMetrics.stringWidth(watermarkText);
        int x = originalImage.getWidth() - textWidth - 10;
        int y = originalImage.getHeight() - 10;
        
        graphics.drawString(watermarkText, x, y);
        graphics.dispose();

        log.info("Watermark applied successfully");
        return watermarkedImage;
    }

    @Override
    public BufferedImage enhanceImageQuality(BufferedImage originalImage) {
        log.info("Enhancing image quality");

        BufferedImage enhancedImage = new BufferedImage(
                originalImage.getWidth(), 
                originalImage.getHeight(), 
                BufferedImage.TYPE_INT_RGB
        );
        
        Graphics2D graphics = enhancedImage.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics.setRenderingHint(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_QUALITY);
        
        graphics.drawImage(originalImage, 0, 0, null);
        graphics.dispose();

        log.info("Image quality enhanced successfully");
        return enhancedImage;
    }

    @Override
    public boolean validateImageDimensions(BufferedImage image, int maxWidth, int maxHeight) {
        boolean isValid = image.getWidth() <= maxWidth && image.getHeight() <= maxHeight;
        log.info("Image dimensions validation: {}x{} <= {}x{} = {}", 
                image.getWidth(), image.getHeight(), maxWidth, maxHeight, isValid);
        return isValid;
    }

    @Override
    public String optimizeImageForWeb(String inputPath, String outputPath, float quality) throws IOException {
        log.info("Optimizing image for web: {} -> {} with quality {}", inputPath, outputPath, quality);

        BufferedImage originalImage = loadImage(inputPath);
        
        BufferedImage optimizedImage = enhanceImageQuality(originalImage);
        
        String format = getImageFormat(inputPath);
        String savedPath = saveProcessedImage(optimizedImage, outputPath, format);
        
        log.info("Image optimized for web successfully");
        return savedPath;
    }
} 