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
    },
    has_pdf: {
        type: Boolean,
        default: false
    },
    gen_seed: {
        type: Number,
        default: 420
    }
},
    {
        timestamps: true
    });

module.exports = model("Book", BookSchema);