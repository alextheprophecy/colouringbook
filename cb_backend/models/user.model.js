const {Schema, model} = require("mongoose")
const bcrypt = require("bcryptjs")

const DEFAULT_CREDITS = 0

const UserSchema = new Schema({
    full_name: {
        type: String,
        required: function() {
            return !this.googleId; // Only required for non-Google users
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Only required for non-Google users
        }
    },
    credits: {
        type: Number,
        default: DEFAULT_CREDITS
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
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