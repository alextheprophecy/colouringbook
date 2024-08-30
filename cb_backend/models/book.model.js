const {Schema, model} = require('mongoose')

const BookSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    userId: {
        type:String,
        required:true
    },
    res_path: {
        type: String,
        required: true
    }
});
module.exports = model("Book", BookSchema);