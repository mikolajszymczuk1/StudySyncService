import { check, validationResult, type ValidationChain } from 'express-validator';
import { StatusCodesEnum } from '@/enums/StatusCodesEnum';
import type { Request, Response, NextFunction } from 'express';

/**
 * Trim field
 * @param {string} fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const coreValid = (fieldName: string): ValidationChain => check(fieldName).trim();

/**
 * Base field validation
 * @param {string} fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const baseValid = (fieldName: string): ValidationChain =>
  coreValid(fieldName).notEmpty().withMessage('Value must be not empty');

/**
 * Check if field is number
 * @param {string} fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const fieldValidNumber = (fieldName: string): ValidationChain =>
  baseValid(fieldName).isNumeric().withMessage('Value should be a number');

/**
 * Check if field is string
 * @param {string} fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const fieldValidString = (fieldName: string): ValidationChain =>
  baseValid(fieldName).isString().withMessage('value must be a string');

/**
 * Check if field is boolean
 * @param fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const fieldValidBoolean = (fieldName: string): ValidationChain =>
  baseValid(fieldName).isBoolean().withMessage('value must be a boolean');

/**
 * Check if field is string but can be empty
 * @param {string} fieldName field name
 * @returns {ValidationChain} validation chain
 */
export const fieldValidStringEmpty = (fieldName: string): ValidationChain =>
  coreValid(fieldName).isString().withMessage('value must be a string');

/**
 * Middleware to check if there are some request errors and send specific message
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next function
 */
export const validRequest = (req: Request, res: Response, next: NextFunction) => {
  const validResult = validationResult(req);
  if (!validResult.isEmpty()) {
    return res.status(StatusCodesEnum.ResourceForbidden).json({ errors: validResult.array() });
  }

  return next();
};
