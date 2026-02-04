/**
 * JARVIS UTILS: Validators
 */
export const validators = {
  required: (message = 'Campo obrigatório') => (value: any) =>
    !value || (typeof value === 'string' && !value.trim()) ? message : undefined,

  email: (message = 'Email inválido') => (value: string) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? message : undefined,

  minLength: (min: number, message?: string) => (value: string) =>
    value && value.length < min ? message || `Mínimo ${min} caracteres` : undefined,

  pattern: (regex: RegExp, message = 'Formato inválido') => (value: string) =>
    value && !regex.test(value) ? message : undefined,
};