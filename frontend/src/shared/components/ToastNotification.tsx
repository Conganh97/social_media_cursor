import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ToastMessage } from '@/shared/types';

interface ToastNotificationProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onClose,
}) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(toast.id);
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={toast.persistent ? null : toast.duration || 6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={toast.type}
        onClose={handleClose}
        action={
          toast.persistent ? (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : undefined
        }
      >
        {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification; 