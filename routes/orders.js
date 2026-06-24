const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');

// Validation middleware
const validateOrder = [
    body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
    body('customer.email').isEmail().withMessage('Valid email is required'),
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.name').notEmpty().withMessage('Item name is required'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be positive'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1')
];

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { status, limit = 50 } = req.query;

        let filter = {};
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', validateOrder, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const order = await Order.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Public (should be protected in production)
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }

        const validStatuses = ['pending', 'preparing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/orders/:id
// @desc    Delete/cancel an order
// @access  Public
router.delete('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Instead of deleting, update status to cancelled
        order.status = 'cancelled';
        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
