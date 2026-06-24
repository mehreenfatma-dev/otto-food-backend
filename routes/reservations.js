const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');

// Validation middleware
const validateReservation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
    body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20')
];

// @route   GET /api/reservations
// @desc    Get all reservations
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { status, date } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(filter).sort({ date: 1, time: 1 });

        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/reservations/:id
// @desc    Get single reservation
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'Reservation not found'
            });
        }

        res.json({
            success: true,
            data: reservation
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/reservations
// @desc    Create a new reservation
// @access  Public
router.post('/', validateReservation, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            message: `Reservation for ${req.body.name} confirmed!`,
            data: reservation
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel a reservation
// @access  Public
router.delete('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'Reservation not found'
            });
        }

        // Update status to cancelled instead of deleting
        reservation.status = 'cancelled';
        await reservation.save();

        res.json({
            success: true,
            message: 'Reservation cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
