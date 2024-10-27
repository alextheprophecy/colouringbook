const {Schema, model} = require('mongoose')

const Book2Schema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        default: 0
    },
    finished: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = model("Book2", Book2Schema);