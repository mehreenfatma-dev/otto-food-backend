const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');

// Validation middleware
const validateFeedback = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('experience').isIn(['good', 'average', 'poor']).withMessage('Invalid experience type'),
    body('category').isIn(['food', 'service', 'delivery', 'cleanliness', 'pricing', 'other'])
        .withMessage('Invalid feedback category'),
    body('message').trim().isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters')
];

// @route   GET /api/feedback
// @desc    Get all feedback
// @access  Public (should be protected in production)
router.get('/', async (req, res, next) => {
    try {
        const { rating, category, limit = 50 } = req.query;

        let filter = {};
        if (rating) filter.rating = parseInt(rating);
        if (category) filter.category = category;

        const feedbacks = await Feedback.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Calculate statistics
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalFeedback: { $sum: 1 },
                    goodCount: {
                        $sum: { $cond: [{ $eq: ['$experience', 'good'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            count: feedbacks.length,
            stats: stats[0] || {},
            data: feedbacks
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/feedback
// @desc    Submit new feedback
// @access  Public
router.post('/', validateFeedback, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const feedback = await Feedback.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!',
            data: feedback
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics
// @access  Public
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalFeedback: { $sum: 1 },
                    excellent: {
                        $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
                    },
                    good: {
                        $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
                    },
                    average: {
                        $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
                    },
                    poor: {
                        $sum: { $cond: [{ $lte: ['$rating', 2] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0] || {
                averageRating: 0,
                totalFeedback: 0,
                excellent: 0,
                good: 0,
                average: 0,
                poor: 0
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
