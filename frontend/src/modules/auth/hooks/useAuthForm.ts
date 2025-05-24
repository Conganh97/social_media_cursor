import { useState, useCallback } from 'react';
import { validateEmail, validatePassword, validateUsername, validateName } from '@/shared/utils/validation';
import { LoginCredentials, RegisterData, AuthFormErrors } from '../types/auth.types';

const validateRequired = (value: any, fieldName: string): string | undefined => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return undefined;
};

interface UseAuthFormOptions {
  onSubmit: (data: LoginCredentials | RegisterData) => Promise<any>;
  type: 'login' | 'register';
}

export const useAuthForm = ({ onSubmit, type }: UseAuthFormOptions) => {
  const [formData, setFormData] = useState<Partial<LoginCredentials & RegisterData>>({
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

  const validateField = useCallback((name: string, value: any): string | undefined => {
    switch (name) {
      case 'email':
        const emailError = validateEmail(value);
        return emailError || undefined;
      case 'password':
        const passwordError = validatePassword(value);
        return passwordError || undefined;
      case 'confirmPassword':
        if (type === 'register') {
          const required = validateRequired(value, 'Confirm Password');
          if (required) return required;
          return value !== formData.password ? 'Passwords do not match' : undefined;
        }
        return undefined;
      case 'username':
        if (type === 'register') {
          const usernameError = validateUsername(value);
          return usernameError || undefined;
        }
        return undefined;
      case 'firstName':
        if (type === 'register') {
          const nameError = validateName(value);
          return nameError || undefined;
        }
        return undefined;
      case 'lastName':
        if (type === 'register') {
          const nameError = validateName(value);
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
      ? ['email', 'password']
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

  const handleFieldChange = useCallback((name: string, value: any) => {
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
          email: formData.email!,
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
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, type, onSubmit, validateForm]);

  const resetForm = useCallback(() => {
    setFormData({
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