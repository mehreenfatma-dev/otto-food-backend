const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');

// Validation middleware
const validateMenuItem = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['burger', 'pizza', 'sandwich', 'side', 'drink', 'dessert'])
        .withMessage('Invalid category')
];

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { category, available } = req.query;

        let filter = {};
        if (category) filter.category = category.toLowerCase();
        if (available !== undefined) filter.available = available === 'true';

        const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });

        res.json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/menu
// @desc    Create a new menu item
// @access  Public (should be protected in production)
router.post('/', validateMenuItem, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const menuItem = await MenuItem.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Public (should be protected in production)
router.put('/:id', async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
