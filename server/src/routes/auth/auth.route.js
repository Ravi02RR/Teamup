import { Router } from "express";
import { Register,signIn } from "../../controller/auth/auth.controller.js";
import { upload } from "../../middleware/multer.middleware.js";

const userAuthRouter = Router();

userAuthRouter.post('/register', upload.single('avatar'), Register);
userAuthRouter.post('/login', signIn);


export default userAuthRouter;