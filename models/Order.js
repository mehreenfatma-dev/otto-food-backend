const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Customer email is required'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },
        phone: {
            type: String,
            trim: true
        }
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
            default: 1
        }
    }],
    total: {
        type: Number,
        required: [true, 'Order total is required'],
        min: [0, 'Total cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'preparing', 'completed', 'cancelled'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    specialInstructions: {
        type: String,
        maxlength: [500, 'Special instructions cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total before saving
orderSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
