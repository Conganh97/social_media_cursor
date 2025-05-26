import { useState, useCallback } from 'react';
import { validateEmail, validatePassword, validateUsername, validateName } from '@/shared/utils/validation';
import { LoginCredentials, RegisterData, AuthFormErrors } from '../types/auth.types';

const validateRequired = (value: unknown, fieldName: string): string | undefined => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return undefined;
};

interface UseAuthFormOptions {
  onSubmit: (data: LoginCredentials | RegisterData) => Promise<unknown>;
  type: 'login' | 'register';
}

export const useAuthForm = ({ onSubmit, type }: UseAuthFormOptions) => {
  const [formData, setFormData] = useState<Partial<LoginCredentials & RegisterData>>({
    usernameOrEmail: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: string, value: unknown): string | undefined => {
    const stringValue = typeof value === 'string' ? value : '';
    
    switch (name) {
      case 'usernameOrEmail': {
        if (type === 'login') {
          const required = validateRequired(value, 'Username or Email');
          if (required) return required;
          // Allow either email or username format
          const emailError = validateEmail(stringValue);
          const usernameError = validateUsername(stringValue);
          if (emailError && usernameError) {
            return 'Please enter a valid email address or username';
          }
        }
        return undefined;
      }
      case 'email': {
        if (type === 'register') {
          const emailError = validateEmail(stringValue);
          return emailError || undefined;
        }
        return undefined;
      }
      case 'password': {
        const passwordError = validatePassword(stringValue);
        return passwordError || undefined;
      }
      case 'confirmPassword':
        if (type === 'register') {
          const required = validateRequired(value, 'Confirm Password');
          if (required) return required;
          return stringValue !== formData.password ? 'Passwords do not match' : undefined;
        }
        return undefined;
      case 'username':
        if (type === 'register') {
          const usernameError = validateUsername(stringValue);
          return usernameError || undefined;
        }
        return undefined;
      case 'firstName':
        if (type === 'register') {
          const nameError = validateName(stringValue);
          return nameError || undefined;
        }
        return undefined;
      case 'lastName':
        if (type === 'register') {
          const nameError = validateName(stringValue);
          return nameError || undefined;
        }
        return undefined;
      default:
        return undefined;
    }
  }, [formData.password, type]);

  const validateForm = useCallback((): boolean => {
    const newErrors: AuthFormErrors = {};

    const fieldsToValidate = type === 'login' 
      ? ['usernameOrEmail', 'password']
      : ['email', 'password', 'confirmPassword', 'username', 'firstName', 'lastName'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof AuthFormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, type, validateField]);

  const handleFieldChange = useCallback((name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof AuthFormErrors]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [errors, validateField]);

  const handleFieldBlur = useCallback((name: string) => {
    const value = formData[name as keyof typeof formData];
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (type === 'login') {
        await onSubmit({
          usernameOrEmail: formData.usernameOrEmail!,
          password: formData.password!,
          rememberMe: formData.rememberMe,
        } as LoginCredentials);
      } else {
        await onSubmit({
          email: formData.email!,
          password: formData.password!,
          confirmPassword: formData.confirmPassword!,
          username: formData.username!,
          firstName: formData.firstName!,
          lastName: formData.lastName!,
        } as RegisterData);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, type, onSubmit, validateForm]);

  const resetForm = useCallback(() => {
    setFormData({
      usernameOrEmail: '',
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      firstName: '',
      lastName: '',
      rememberMe: false,
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const getFieldProps = useCallback((name: string) => ({
    value: formData[name as keyof typeof formData] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      handleFieldChange(name, value);
    },
    onBlur: () => handleFieldBlur(name),
    error: !!errors[name as keyof AuthFormErrors],
    helperText: errors[name as keyof AuthFormErrors] || '',
  }), [formData, errors, handleFieldChange, handleFieldBlur]);

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
    handleFieldBlur,
    resetForm,
    getFieldProps,
    validateForm,
  };
}; 