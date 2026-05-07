import mongoose from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    profileImageUrl: string | null;
    role: 'admin' | 'user' | 'member';
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profileImageUrl: {type: String, default: null},
    role: {type: String, enum: ['admin', 'user', 'member'], default: 'user'},
}, {timestamps: true}
)

export default mongoose.model<IUser>('User', UserSchema);

