const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    // Get signed jwt token
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token
    });
});

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and a password', 400)
        );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatchedPassword = await user.compareHashedPassword(password);

    if (!isMatchedPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    });
});