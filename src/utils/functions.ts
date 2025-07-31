import bcrypt from 'bcrypt';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { convert } from 'html-to-text';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose, { ObjectId } from 'mongoose';
import UserRepository from '../repositories/user.repository';
import appConfig from '../config';
import { UserDocument } from '../models/user.model';

const userRepo = new UserRepository();

export const cloudinaryUpload = async (url: string) => {
    if (url) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const upload = await cloudinary.uploader.upload(url, {
            folder: 'BCA_HealthCare'
        });
        return upload;
    }
};

export const cloudinaryDestroy = async (publicId: string) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const upload = await cloudinary.uploader.destroy(publicId);
    return upload;
};

export const verifyJWT = async (token: string) => {
    try {
        return {
            payload: jwt.verify(token, appConfig.JWT.secret),
            expired: false
        };
    } catch (error) {
        if ((error as Error).name === 'TokenExpiredError') {
            return { payload: jwt.decode(token), expired: true };
        }
        throw error;
    }
};

export const generateHash = async (plainPassword: string): Promise<string> => {
    const hash = await bcrypt.hash(
        plainPassword + appConfig.BCRYPT.pepper,
        appConfig.BCRYPT.saltRound
    );
    return hash;
};

export const isPasswordCorrect = async function (
    candidatePassword: string,
    userPassword: string
) {
    const result = await bcrypt.compare(
        candidatePassword + appConfig.BCRYPT.pepper,
        userPassword
    );
    return result;
};

export const isValidMongoId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const convertIdToMongoId = (id: string): ObjectId => {
    const objectId: any = new mongoose.Types.ObjectId(id);
    return objectId;
};

export const generateRandomCode = async (
    size = 8,
    alpha = true
): Promise<string | number> => {
    const characters = alpha
        ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
        : '0123456789';
    const chars = characters.split('');
    let selections = '';
    for (let i = 0; i < size; i += 1) {
        const index = Math.floor(Math.random() * chars.length);
        selections += chars[index];
        chars.splice(index, 1);
    }
    return selections;
};

export const generateOtpCode = async () => {
    const OTP = (await generateRandomCode(6, false)) as number;
    return {
        OTP,
        otpExpiresAt: Date.now() + 10 * 60 * 1000
    };
};

export const convertEmailToText = async (html: string) => {
    const result = convert(html, {
        wordwrap: 150
    });
    return result;
};

export const comparePassword = async (
    password: string,
    hashPassword: string
): Promise<boolean> => {
    const result = await bcrypt.compare(
        password + appConfig.BCRYPT.pepper,
        hashPassword
    );
    return result;
};

export const generateToken = async (email: string) => {
    const REFRESH_TOKEN_SECRET: string = appConfig.JWT.refresh_token_expires_in;
    const ACCESS_TOKEN_SECRET: string = appConfig.JWT.access_token_secret;
    const payload: Partial<UserDocument> | null = await userRepo.findOne({
        email
    });
    const data = {
        id: payload?._id,
        role: payload?.role
    };
    const accessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, {
        expiresIn: '1800s',
        algorithm: 'HS256'
    });
    const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
        algorithm: 'HS256'
    });
    return Promise.resolve({ accessToken, refreshToken });
};

export const verifyToken = (email: string, token: string) => {
    try {
        const decoded: JwtPayload = jwt.decode(token) as JwtPayload;
        const expirationTime = decoded.exp as number;
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > expirationTime || decoded.email !== email) {
            // token has expired
            return false;
        }
        // token is still valid
        return true;
    } catch (error) {
        return error;
    }
};

export const decodeJwtToken = (token: string) => {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
};

export const getDateTime = () => {
    const currentDate = new Date();
    const datetime = `Last Sync: ${currentDate.getDate()}/${
        currentDate.getMonth() + 1
    }/${currentDate.getFullYear()} @ ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    return datetime;
};

// Get single file path
export const getFilePath = (req: any) => {
    const filePath = req.file;
    if (filePath) {
        const file = String(filePath.path);
        return file;
    }
};
// Get multiple file path
export const getMultipleFilePath = (req: any): any => {
    const { files } = req;
    const file1 = String(files[0] && files[0].path);
    const file2 = String(files[0] && files[1].path);
    return {
        file1,
        file2
    };
};
// create folder to store images/files
export const fileStorageEngine = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const dir = `${path.normalize(path.join(__dirname, '../images'))}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },

    filename: (req: any, file: any, cb: any) => {
        cb(null, `${Date.now()}--${path.extname(file.originalname)}`);
    }
});

// check file/images
export const fileFilter = (req: any, file: any, cb: any) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb({ message: `Unsupported file format ${file.mimetype}` });
    }
};

export const upload = multer({
    storage: fileStorageEngine,
    limits: { fileSize: 4200 * 3800 },
    fileFilter
});

export const multipleUpload = upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 },
    { name: 'file5', maxCount: 1 }
]);
