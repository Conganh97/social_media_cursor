import React from 'react';
import { Box } from '@mui/material';
import { useToast } from '@/shared/hooks';
import ToastNotification from './ToastNotification';

const ToastManager: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <Box
      position="fixed"
      top={16}
      right={16}
      zIndex={9999}
      display="flex"
      flexDirection="column"
      gap={1}
      maxWidth={400}
    >
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={hideToast}
        />
      ))}
    </Box>
  );
};

export default ToastManager; 