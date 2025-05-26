import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Typography
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  replyToMessage?: { id: string; content: string; senderName: string } | null;
  onCancelReply?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Type a message...",
  replyToMessage,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart?.();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop?.();
    }, 2000);
  }, [isTyping, onTypingStart, onTypingStop]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMessage(value);

    if (value.trim()) {
      handleTypingStart();
    } else if (isTyping) {
      setIsTyping(false);
      onTypingStop?.();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage && attachments.length === 0) return;

    onSendMessage(trimmedMessage, attachments.length > 0 ? attachments : undefined);
    
    setMessage('');
    setAttachments([]);
    setIsTyping(false);
    onTypingStop?.();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      {/* Reply Preview */}
      {replyToMessage && (
        <Box
          sx={{
            mb: 2,
            p: 1,
            bgcolor: 'grey.100',
            borderRadius: 1,
            borderLeft: 3,
            borderColor: 'primary.main',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="caption" color="primary" fontWeight="bold">
              Replying to {replyToMessage.senderName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {replyToMessage.content}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onCancelReply}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Attachments ({attachments.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((file, index) => (
              <Chip
                key={index}
                label={`${file.name} (${formatFileSize(file.size)})`}
                onDelete={() => removeAttachment(index)}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Message Input */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
        
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          size="small"
          sx={{ mb: 0.5 }}
        >
          <AttachFileIcon />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder={placeholder}
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" disabled={disabled}>
                  <EmojiIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: 'divider'
              },
              '&:hover fieldset': {
                borderColor: 'primary.main'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
        />

        <IconButton
          onClick={handleSendMessage}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          color="primary"
          sx={{
            mb: 0.5,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            '&.Mui-disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageInput; 