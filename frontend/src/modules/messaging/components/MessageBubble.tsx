import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon
} from '@mui/icons-material';
import { Message, Conversation, MessageType } from '../types/message.types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  conversation: Conversation;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  conversation,
  onEdit,
  onDelete,
  onReply
}) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderInfo = () => {
    if (isOwn) return null;
    
    const sender = conversation.participants.find(p => p.id === message.senderId);
    return sender;
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case MessageType.TEXT:
        return (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        );
      
      case MessageType.IMAGE:
        return (
          <Box>
            {message.attachments?.map((attachment, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <img
                  src={attachment.fileUrl}
                  alt={attachment.fileName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
            {message.content && (
              <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-word' }}>
                {message.content}
              </Typography>
            )}
          </Box>
        );
      
      case MessageType.FILE:
        return (
          <Box>
            {message.attachments?.map((attachment, index) => (
              <Chip
                key={index}
                label={attachment.fileName}
                variant="outlined"
                sx={{ mb: 1, mr: 1 }}
                onClick={() => window.open(attachment.fileUrl, '_blank')}
              />
            ))}
            {message.content && (
              <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-word' }}>
                {message.content}
              </Typography>
            )}
          </Box>
        );
      
      case MessageType.SYSTEM:
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontStyle: 'italic', 
              color: 'text.secondary',
              textAlign: 'center'
            }}
          >
            {message.content}
          </Typography>
        );
      
      default:
        return (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        );
    }
  };

  if (message.messageType === MessageType.SYSTEM) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Paper
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: 'grey.100',
            borderRadius: 2
          }}
        >
          {renderMessageContent()}
        </Paper>
      </Box>
    );
  }

  const sender = getSenderInfo();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: isLastInGroup ? 2 : 0.5,
        mx: 1
      }}
    >
      {!isOwn && isLastInGroup && (
        <Avatar
          src={sender?.profilePictureUrl}
          sx={{ width: 32, height: 32, mr: 1, alignSelf: 'flex-end' }}
        >
          {sender?.firstName?.charAt(0)}
        </Avatar>
      )}
      
      {!isOwn && !isLastInGroup && (
        <Box sx={{ width: 32, mr: 1 }} />
      )}

      <Box sx={{ maxWidth: '70%' }}>
        {!isOwn && isFirstInGroup && conversation.isGroup && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ ml: 1, mb: 0.5, display: 'block' }}
          >
            {sender?.firstName} {sender?.lastName}
          </Typography>
        )}

        <Paper
          sx={{
            p: 1.5,
            bgcolor: isOwn ? 'primary.main' : 'background.paper',
            color: isOwn ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            borderTopLeftRadius: !isOwn && isFirstInGroup ? 1 : 2,
            borderTopRightRadius: isOwn && isFirstInGroup ? 1 : 2,
            borderBottomLeftRadius: !isOwn && isLastInGroup ? 1 : 2,
            borderBottomRightRadius: isOwn && isLastInGroup ? 1 : 2,
            position: 'relative',
            '&:hover .message-actions': {
              opacity: 1
            }
          }}
        >
          {renderMessageContent()}
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontSize: '0.7rem'
              }}
            >
              {formatTime(message.timestamp)}
              {message.isEdited && ' (edited)'}
            </Typography>

            {isOwn && (
              <Box
                className="message-actions"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  ml: 1
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(message.id)}
                  sx={{ 
                    color: 'inherit', 
                    p: 0.25,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete?.(message.id)}
                  sx={{ 
                    color: 'inherit', 
                    p: 0.25,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {!isOwn && (
            <IconButton
              size="small"
              onClick={() => onReply?.(message.id)}
              sx={{
                position: 'absolute',
                right: -40,
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                '.message-bubble:hover &': {
                  opacity: 1
                }
              }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageBubble; 