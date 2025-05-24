import { ValidationRule, FormValidation } from '@/shared/types';
import { VALIDATION_RULES } from './constants';

export const validateField = (value: any, rules: ValidationRule): string | null => {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return rules.message || 'This field is required';
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Maximum length is ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ValidationRule>
): FormValidation => {
  const errors: Record<string, string> = {};
  const touched: Record<string, boolean> = {};

  Object.keys(rules).forEach((field) => {
    const fieldValue = data[field];
    const fieldRules = rules[field];
    const error = validateField(fieldValue, fieldRules);
    
    if (error) {
      errors[field] = error;
    }
    
    touched[field] = true;
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    touched,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export const validateEmail = (email: string): string | null => {
  return validateField(email, {
    required: true,
    pattern: VALIDATION_RULES.EMAIL.PATTERN,
    message: 'Please enter a valid email address',
  });
};

export const validatePassword = (password: string): string | null => {
  return validateField(password, {
    required: true,
    minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    maxLength: VALIDATION_RULES.PASSWORD.MAX_LENGTH,
    pattern: VALIDATION_RULES.PASSWORD.PATTERN,
    message: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
  });
};

export const validateUsername = (username: string): string | null => {
  return validateField(username, {
    required: true,
    minLength: VALIDATION_RULES.USERNAME.MIN_LENGTH,
    maxLength: VALIDATION_RULES.USERNAME.MAX_LENGTH,
    pattern: VALIDATION_RULES.USERNAME.PATTERN,
    message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  });
};

export const validateName = (name: string): string | null => {
  return validateField(name, {
    required: true,
    minLength: VALIDATION_RULES.NAME.MIN_LENGTH,
    maxLength: VALIDATION_RULES.NAME.MAX_LENGTH,
    message: 'Name must be 1-50 characters',
  });
};

export const validatePostContent = (content: string): string | null => {
  return validateField(content, {
    required: true,
    maxLength: VALIDATION_RULES.POST_CONTENT.MAX_LENGTH,
    message: `Post content cannot exceed ${VALIDATION_RULES.POST_CONTENT.MAX_LENGTH} characters`,
  });
};

export const validateCommentContent = (content: string): string | null => {
  return validateField(content, {
    required: true,
    maxLength: VALIDATION_RULES.COMMENT_CONTENT.MAX_LENGTH,
    message: `Comment cannot exceed ${VALIDATION_RULES.COMMENT_CONTENT.MAX_LENGTH} characters`,
  });
};

export const validateFileUpload = (file: File): string | null => {
  if (!file) {
    return 'Please select a file';
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'File size cannot exceed 5MB';
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, GIF, and WebP images are allowed';
  }

  return null;
}; 