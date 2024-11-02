import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true,
        enum: ['Web Development', 'Mobile Development', 'AI/ML', 'Blockchain', 
               'IoT', 'Cybersecurity', 'Data Science', 'Other']
    },
    requiredMembers: {
        type: Number,
        required: true,
        min: 1
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open'
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    skills: [{
        type: String
    }],
    deadline: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Project = mongoose.model('Project', projectSchema);
