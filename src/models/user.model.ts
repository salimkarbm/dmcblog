import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
    fullName?: string;
    email: string;
    role: 'User' | 'Moderator' | 'Admin';
    password: string;
    OTP?: number;
    passwordChangedAt?: Date;
    passwordResetOtp?: number;
    otpExpiresAt?: Date;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
}

export type UserDocument = IUser & Document;

export const userSchema = new mongoose.Schema<UserDocument>({
    fullName: {
        type: String
    },

    email: {
        type: String,
        required: [true, 'An email must be provided'],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['User', 'Moderator', 'Admin'],
        default: 'User'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    OTP: {
        type: Number
    },
    passwordChangedAt: Date,
    passwordResetOtp: Number,
    otpExpiresAt: Date,
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const User: Model<UserDocument> = mongoose.model<UserDocument>(
    'User',
    userSchema
);
