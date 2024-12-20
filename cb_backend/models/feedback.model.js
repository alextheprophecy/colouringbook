const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4', '5']
    },
    comment: {
        type: String,
        required: false
    },
    route: {
        type: String,
        default: 'OTHER',
        required: true,
        uppercase: true
    }
}, {
    timestamps: true
});

module.exports = model("Feedback", FeedbackSchema); 