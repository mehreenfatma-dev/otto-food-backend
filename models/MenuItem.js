const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        max: [10000, 'Price cannot exceed 10000']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['burger', 'pizza', 'sandwich', 'side', 'drink', 'dessert'],
            message: '{VALUE} is not a valid category'
        },
        lowercase: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=Food+Item'
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
