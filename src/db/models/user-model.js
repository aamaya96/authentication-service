const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true, 
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email has an invalid format');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    management: {
        created: {
            type: Number,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updated: {
            type: Number,
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Error while trying to login, please check your credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Error while trying to login, please check your credentials');
    }

    return user;
};

userSchema.methods.generateToken = async function() {
    const user = this;
    await user.populate('role').execPopulate();

    //TODO: update key signature for JWT token
    const token = jwt.sign({ 
        _id: user._id.toString(), 
        role: user.role.name
    }, 'hello-world', { expiresIn: '1h' });

    return token;
};

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

userSchema.pre('save', async function(next) {
    const user = this;
    
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;