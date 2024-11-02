import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/, 'Please enter a valid email ending with @vitbhopal.ac.in']
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
}]
});

export const userModel = mongoose.model('User', userSchema);
