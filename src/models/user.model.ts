import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // Add index for faster queries
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false, // Don't return password by default in queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // Added default value
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        trim: true,
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorSecret: {
        type: String,
        select: false, // Don't return by default
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    resetPasswordToken: { // Fixed: capital 'P' for consistency
        type: String,
        select: false, // Don't return by default
    },
    resetPasswordTokenExpiry: { // Fixed: capital 'P' for consistency
        type: Date,
    },
}, {
    timestamps: true, // Moved to schema options
});

export const User = model('User', userSchema);