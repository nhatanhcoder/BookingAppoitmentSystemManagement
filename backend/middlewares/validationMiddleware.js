import { body, validationResult } from 'express-validator';

// Validation middleware for user registration
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập tên')
        .isLength({ min: 2 })
        .withMessage('Tên phải có ít nhất 2 ký tự'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Địa chỉ email không hợp lệ')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt')
];

// Validation middleware for login
export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Địa chỉ email không hợp lệ')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu')
];

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array().map(err => err.msg) 
        });
    }
    next();
};
