import { body } from 'express-validator';
import { validate } from './validate.js';
import { ValidationError } from '../errors/validation.js';

export const createTripValidator = [
    body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Title is required"),
  body("startDate")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Start date is required")
    .toDate()
    .withMessage("Start date must be a date"),
  body("endDate")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("End date is required")
    .toDate()
    .withMessage("End date must be a date")
    .custom((value, { req }) => {
      if (value < req.body.startDate) {
        throw new ValidationError("End date must be after start date");
      }
      return true;
    }),
  body("destinations")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Destinations are required")
    .isArray()
    .withMessage("Destinations must be an array")
    .custom((value) => {
      return value.every((destination) => typeof destination === "string");
    })
    .withMessage("Destinations must be an array of strings"),
  body("budget.total")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Total budget is required")
    .isNumeric()
    .withMessage("Total budget must be a number"),
  body("budget.expenses")
    .optional()
    .isArray()
    .withMessage("Expenses must be an array"),
  body("budget.expenses.*.name")
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Expense name is required"),
  body("budget.expenses.*.amount")
    .optional()
    .trim()
    .escape()
    .isNumeric()
    .withMessage("Expense amount must be a number"),
  validate,
];