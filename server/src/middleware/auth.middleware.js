import jwt from 'jsonwebtoken';
import { userModel } from '../model/user/user.model.js';
import { env } from '../config/confo.js';

export const userAuthMiddleware = async (req, res, next) => {
    try {
        console.log("User authentication middleware");
        console.log(req.cookies);
        console.log(req.cookies.access_token);
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }

        const decodedData = jwt.verify(token, env.jwt.secret);


        const user = await userModel.findById(decodedData.id);
        if (!user) {
            return res.status(401).json({
                error: "No such user found"
            });
        }


        req.userID = decodedData.id;
        next();

    } catch (error) {
        console.error("User authentication error:", error);
        return res.status(401).json({
            error: "Unauthorized access"
        });
    }
};
