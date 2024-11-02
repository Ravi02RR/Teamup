
import express from 'express';
import { userAuthMiddleware } from '../../middleware/auth.middleware.js';
import {
    createProject,
    getAllProjects,
    getProjectById,
    joinProject,
    updateProjectStatus,
    getMyProjects,
    searchProjects
} from '../../controller/work/project.controller.js';

const projectRouter = express.Router();

projectRouter.post('/create', userAuthMiddleware, createProject);
projectRouter.get('/all', getAllProjects);
projectRouter.get('/my-projects', userAuthMiddleware, getMyProjects);
projectRouter.get('/search', searchProjects);
projectRouter.get('/:id', getProjectById);
projectRouter.post('/:id/join', userAuthMiddleware, joinProject);
projectRouter.patch('/:id/status', userAuthMiddleware, updateProjectStatus);

export default projectRouter;