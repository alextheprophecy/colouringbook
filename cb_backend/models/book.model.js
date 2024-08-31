const {Schema, model} = require('mongoose')

const BookSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true,
        default: 0
    }
},
    {
        timestamps: true
    });

module.exports = model("Book", BookSchema);