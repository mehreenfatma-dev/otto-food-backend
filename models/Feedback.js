const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    experience: {
        type: String,
        enum: {
            values: ['good', 'average', 'poor'],
            message: '{VALUE} is not a valid experience type'
        },
        required: true
    },
    category: {
        type: String,
        required: [true, 'Feedback category is required'],
        enum: {
            values: ['food', 'service', 'delivery', 'cleanliness', 'pricing', 'other'],
            message: '{VALUE} is not a valid category'
        }
    },
    message: {
        type: String,
        required: [true, 'Feedback message is required'],
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    contactPermission: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
