import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],

    },
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
    },
    avatarUrl: {
        type: String,
    },
    role: {
        type: String,
        default: 'client'
    },
    subscription: {
        type: String,
        default: 'free'
    },
    subscriptionId: {
       type: String,
    }


})

const User = models.User || model("User", UserSchema);

export default User;