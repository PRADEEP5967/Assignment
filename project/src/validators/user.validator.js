import Joi from 'joi';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

export const registerValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  
  fullName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 50 characters',
      'any.required': 'Full name is required'
    }),
  
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .required()
    .messages({
      'any.only': 'Gender must be either male, female, or other',
      'any.required': 'Gender is required'
    }),
  
  dateOfBirth: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'any.required': 'Date of birth is required'
    }),
  
  country: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 50 characters',
      'any.required': 'Country is required'
    })
});

export const loginValidator = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username or email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});