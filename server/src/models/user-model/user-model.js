const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const { USER_ROLE } = require('../../config/system-variables');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxLength: [50, 'Name must be less than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: 'user'
    },
    active: {
        type: Boolean,
        default: false
    }, 

    phone: {
        type: String,
        trim: true,
    },
    
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', userSchema);