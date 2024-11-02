import { Project } from "../../model/work/project.model.js";
import mongoose from 'mongoose';
export const createProject = async (req, res) => {
    try {
        const { title, description, domain, requiredMembers, skills, deadline } = req.body;

        const project = new Project({
            title,
            description,
            domain,
            requiredMembers,
            creator: req.userID,
            skills,
            deadline: new Date(deadline)
        });

        await project.save();

        res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid project ID'
            });
        }

        const project = await Project.findById(id)
            .populate('creator', 'name email avatar registrationNumber')
            .populate('members.user', 'name email avatar registrationNumber');

        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        const projectStats = {
            totalMembers: project.members.length,
            acceptedMembers: project.members.filter(member => member.status === 'Accepted').length,
            pendingRequests: project.members.filter(member => member.status === 'Pending').length,
            availableSpots: project.requiredMembers - project.members.filter(member => member.status === 'Accepted').length,
            isDeadlinePassed: project.deadline ? new Date() > project.deadline : false,
            daysUntilDeadline: project.deadline ?
                Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
        };

        res.status(200).json({
            project,
            projectStats
        });
    } catch (error) {
        console.error('Get project by ID error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const joinProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        // Check if user is already a member
        const existingMember = project.members.find(
            member => member.user.toString() === req.userID
        );

        if (existingMember) {
            return res.status(400).json({
                error: 'You have already joined/requested to join this project'
            });
        }


        if (project.members.length >= project.requiredMembers) {
            return res.status(400).json({
                error: 'Project team is full'
            });
        }

        project.members.push({
            user: req.userID,
            role,
            status: 'Pending'
        });

        await project.save();

        res.status(200).json({
            message: 'Join request sent successfully',
            project
        });
    } catch (error) {
        console.error('Join project error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getMyProjects = async (req, res) => {
    try {
        const createdProjects = await Project.find({ creator: req.userID })
            .populate('creator', 'name email')
            .populate('members.user', 'name email');

        const joinedProjects = await Project.find({
            'members.user': req.userID
        })
            .populate('creator', 'name email')
            .populate('members.user', 'name email');

        res.status(200).json({
            createdProjects,
            joinedProjects
        });
    } catch (error) {
        console.error('Get my projects error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const searchProjects = async (req, res) => {
    try {
        const { domain, status, skills } = req.query;

        const query = {};

        if (domain) query.domain = domain;
        if (status) query.status = status;
        if (skills) {
            query.skills = {
                $in: skills.split(',').map(skill => skill.trim())
            };
        }

        const projects = await Project.find(query)
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            projects
        });
    } catch (error) {
        console.error('Search projects error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, memberId, memberStatus } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }


        if (project.creator.toString() !== req.userID) {
            return res.status(403).json({
                error: 'Unauthorized to update project status'
            });
        }

        if (status) {
            project.status = status;
        }

        if (memberId && memberStatus) {
            const memberIndex = project.members.findIndex(
                member => member.user.toString() === memberId
            );

            if (memberIndex !== -1) {
                project.members[memberIndex].status = memberStatus;
            }
        }

        await project.save();

        res.status(200).json({
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Update project status error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};