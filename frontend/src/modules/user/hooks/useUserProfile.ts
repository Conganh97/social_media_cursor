import { useState, useCallback } from 'react';
import { validateEmail, validateName, validateUsername } from '@/shared/utils/validation';
import { UserFormData, UserFormErrors, UpdateUserData } from '../types/user.types';
import { useUser } from './useUser';

interface UseUserProfileOptions {
  initialData?: Partial<UserFormData>;
  onSuccess?: (data: UpdateUserData) => void;
}

export const useUserProfile = (options: UseUserProfileOptions = {}) => {
  const { updateProfile, uploadAvatar, isUpdating, isUploading, error } = useUser();
  const { initialData, onSuccess } = options;

  const [formData, setFormData] = useState<UserFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    username: initialData?.username || '',
    email: initialData?.email || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    phoneNumber: initialData?.phoneNumber || '',
    isPrivate: initialData?.isPrivate || false,
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback((name: string, value: any): string | undefined => {
    switch (name) {
      case 'firstName':
        const firstNameError = validateName(value);
        return firstNameError || undefined;
      case 'lastName':
        const lastNameError = validateName(value);
        return lastNameError || undefined;
      case 'username':
        const usernameError = validateUsername(value);
        return usernameError || undefined;
      case 'email':
        const emailError = validateEmail(value);
        return emailError || undefined;
      case 'bio':
        return value && value.length > 500 ? 'Bio must be less than 500 characters' : undefined;
      case 'website':
        if (value && value.trim()) {
          const urlPattern = /^https?:\/\/.+\..+/;
          return !urlPattern.test(value) ? 'Please enter a valid URL' : undefined;
        }
        return undefined;
      case 'phoneNumber':
        if (value && value.trim()) {
          const phonePattern = /^\+?[\d\s\-\(\)]+$/;
          return !phonePattern.test(value) ? 'Please enter a valid phone number' : undefined;
        }
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: UserFormErrors = {};
    const fieldsToValidate = ['firstName', 'lastName', 'username', 'email', 'bio', 'website', 'phoneNumber'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field as keyof UserFormData]);
      if (error) {
        newErrors[field as keyof UserFormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    if (errors[name as keyof UserFormErrors]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [errors, validateField]);

  const handleFieldBlur = useCallback((name: string) => {
    const value = formData[name as keyof UserFormData];
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData: UpdateUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        website: formData.website || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        isPrivate: formData.isPrivate,
      };

      const result = await updateProfile(updateData);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setIsDirty(false);
        if (onSuccess) {
          onSuccess(updateData);
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to update profile' });
    }
  }, [formData, validateForm, updateProfile, onSuccess]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    try {
      const result = await uploadAvatar(file);
      return result;
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to upload avatar' });
      throw error;
    }
  }, [uploadAvatar]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      username: initialData?.username || '',
      email: initialData?.email || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      website: initialData?.website || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      phoneNumber: initialData?.phoneNumber || '',
      isPrivate: initialData?.isPrivate || false,
    });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  const getFieldProps = useCallback((name: string) => ({
    value: formData[name as keyof UserFormData] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      handleFieldChange(name, value);
    },
    onBlur: () => handleFieldBlur(name),
    error: !!errors[name as keyof UserFormErrors],
    helperText: errors[name as keyof UserFormErrors] || '',
  }), [formData, errors, handleFieldChange, handleFieldBlur]);

  return {
    formData,
    errors,
    isDirty,
    isUpdating,
    isUploading,
    error,
    handleSubmit,
    handleFieldChange,
    handleFieldBlur,
    handleAvatarUpload,
    resetForm,
    getFieldProps,
    validateForm,
  };
}; 