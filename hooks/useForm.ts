import { useState, useCallback, ChangeEvent } from 'react';

type Validator<T> = (value: T) => string | undefined;
type Validators<T> = Partial<Record<keyof T, Validator<any>>>;

/**
 * JARVIS HOOKS: useForm
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validators?: Validators<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name as keyof T] && validators?.[name as keyof T]) {
        const error = validators[name as keyof T]?.(value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validators]
  );

  const validate = useCallback((): boolean => {
    if (!validators) return true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validators).forEach((key) => {
      const validator = validators[key as keyof T];
      if (validator) {
        const error = validator(values[key as keyof T]);
        if (error) {
          newErrors[key as keyof T] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return isValid;
  }, [values, validators]);

  return { values, errors, touched, handleChange, validate, setValues };
}