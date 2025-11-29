export const validation = {
  required: (message = "This field is required") => ({
    required: message,
  }),

  email: (message = "Please enter a valid email address") => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),

  minLength: (length: number, message?: string) => ({
    minLength: {
      value: length,
      message: message || `Must be at least ${length} characters`,
    },
  }),

  maxLength: (length: number, message?: string) => ({
    maxLength: {
      value: length,
      message: message || `Must be no more than ${length} characters`,
    },
  }),

  min: (value: number, message?: string) => ({
    min: {
      value,
      message: message || `Must be at least ${value}`,
    },
  }),

  max: (value: number, message?: string) => ({
    max: {
      value,
      message: message || `Must be no more than ${value}`,
    },
  }),

  pattern: (pattern: RegExp, message: string) => ({
    pattern: {
      value: pattern,
      message,
    },
  }),

  url: (message = "Please enter a valid URL") => ({
    pattern: {
      value: /^https?:\/\/.+/i,
      message,
    },
  }),

  phone: (message = "Please enter a valid phone number") => ({
    pattern: {
      value: /^[\d\s\-\+\(\)]+$/,
      message,
    },
  }),

  alphanumeric: (message = "Only letters and numbers are allowed") => ({
    pattern: {
      value: /^[a-zA-Z0-9]+$/,
      message,
    },
  }),

  slug: (message = "Only lowercase letters, numbers, and hyphens are allowed") => ({
    pattern: {
      value: /^[a-z0-9-]+$/,
      message,
    },
  }),

  match: (fieldName: string, getValues: (name: string) => any) => ({
    validate: (value: any) => {
      const otherValue = getValues(fieldName);
      return value === otherValue || `Must match ${fieldName}`;
    },
  }),

  custom: (validator: (value: any) => boolean | string, message = "Invalid value") => ({
    validate: (value: any) => {
      const result = validator(value);
      return result === true || (typeof result === "string" ? result : message);
    },
  }),
};

export function combineValidation(...rules: any[]) {
  return rules.reduce((acc, rule) => ({ ...acc, ...rule }), {});
}

export function isValidEmail(email: string): boolean {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

