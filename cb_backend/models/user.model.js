const {Schema, model} = require("mongoose")
const bcrypt = require("bcryptjs")

const DEFAULT_CREDITS = 10*30*2

const UserSchema = new Schema({
    full_name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: DEFAULT_CREDITS
    }
});


UserSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});


UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = model("User", UserSchema);