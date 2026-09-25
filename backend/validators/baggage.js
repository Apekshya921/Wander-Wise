import { body } from 'express-validator';
import { validate } from './validate.js';

export const createBaggageValidator = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Baggage name is required"),
  
];
export const updateBaggageValidator=[
  body("name")
.optional()
.trim()
    .escape()
    .notEmpty()
    .withMessage("Baggage name is required"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed status must be a true or false boolean value"),
  validate,
]