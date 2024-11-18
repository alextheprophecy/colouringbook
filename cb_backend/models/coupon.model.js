const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    credits: {
        type: Number,
        required: true,
        min: 1
    },
    isRedeemed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    },
    redeemedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userEmail: {
            type: String
        },
        redeemedAt: {
            type: Date
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster lookups
couponSchema.index({ code: 1 });
couponSchema.index({ expiresAt: 1 });
couponSchema.index({ isRedeemed: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
