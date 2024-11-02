import jwt from 'jsonwebtoken';
import { env } from '../config/confo.js';
export const generateToken = (id) => {
    return jwt.sign({ id }, env.jwt.secret, { expiresIn: '1h' });
};
