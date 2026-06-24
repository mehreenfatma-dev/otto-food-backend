const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Reservation date is required'],
        validate: {
            validator: function (value) {
                // Date must be today or in the future
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            },
            message: 'Reservation date must be today or in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Reservation time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time (HH:MM)']
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'Must have at least 1 guest'],
        max: [20, 'Cannot accommodate more than 20 guests']
    },
    occasion: {
        type: String,
        enum: ['birthday', 'anniversary', 'business', 'date', 'family', 'other', ''],
        default: ''
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);
