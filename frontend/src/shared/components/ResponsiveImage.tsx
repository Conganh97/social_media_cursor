import { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
  loading?: 'eager' | 'lazy';
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  fallbackSrc,
  loading = 'lazy',
  objectFit = 'cover',
  className,
  onLoad,
  onError,
}: ResponsiveImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
      return;
    }
    
    onError?.();
  };

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (hasError) {
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="grey.100"
        className={className}
      >
        <ImageIcon color="disabled" />
      </Box>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      style={{ objectFit }}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default ResponsiveImage; 