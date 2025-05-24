import { useState, useCallback } from 'react';
import { FormState, FormValidation, ValidationRule } from '@/shared/types';
import { validateForm } from '@/shared/utils';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Record<keyof T, ValidationRule>;
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): FormValidation => {
    if (!validationRules) {
      return {
        isValid: true,
        errors: {},
        touched,
        hasErrors: false,
      };
    }

    return validateForm(values, validationRules);
  }, [values, validationRules, touched]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const handleChange = useCallback((field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFieldValue(field, value);
    
    if (touched[field as string]) {
      clearFieldError(field);
    }
  }, [setFieldValue, touched, clearFieldError]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field);
    
    if (validationRules && validationRules[field]) {
      const validation = validate();
      if (validation.errors[field as string]) {
        setFieldError(field, validation.errors[field as string]);
      }
    }
  }, [setFieldTouched, validationRules, validate, setFieldError]);

  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const validation = validate();
    setErrors(validation.errors);
    setTouched(validation.touched);

    if (!validation.isValid) {
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validation = validate();

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: validation.isValid,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    setFieldValue,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate,
  };
} 