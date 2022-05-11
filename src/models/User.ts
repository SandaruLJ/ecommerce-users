import { IUser } from '../interfaces/IUser';
import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema =  new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    contact: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: false,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        required: true,
        default: 'pending',
    }
});

export default mongoose.model<IUser & mongoose.Document>('users', UserSchema);
