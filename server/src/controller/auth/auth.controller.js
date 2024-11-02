import { userModel } from "../../model/user/user.model.js";
import { registerSchema } from "../../utils/zodValadation.js";
import { uploadOnCloudinary } from "../../cloudinary/cloudinary.js";
import bcrypt from "bcrypt";
import { env } from "../../config/confo.js";
import { generateToken } from "../../utils/generateToken.js";

export const Register = async (req, res) => {
    try {
        const validatedData = await registerSchema.parseAsync(req.body);
        const existingUser = await userModel.findOne({
            $or: [
                { email: validatedData.email },
                { registrationNumber: validatedData.registrationNumber },
            ],
        });

        if (existingUser) {
            return res.status(400).json({
                error: "Email or registration number already exists",
            });
        }
        let avatarUrl = null;
        if (req.file) {
            // console.log(req.file);
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            // console.log(cloudinaryResponse);
            if (cloudinaryResponse) {
                avatarUrl = cloudinaryResponse.secure_url;
            }
        }
        const hashedPassword = await bcrypt.hash(
            validatedData.password,
            env.bcrypt.salt
        );
        const user = await userModel.create({
            name: validatedData.name,
            email: validatedData.email,
            registrationNumber: validatedData.registrationNumber,
            password: hashedPassword,
            avatar: avatarUrl,
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
                registrationNumber: user.registrationNumber,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        if (error.name === "ZodError") {
            return res.status(400).json({
                error: error.issues.map((issue) => issue.message).join(", "),
            });
        }
        if (error.message?.includes("Cloudinary")) {
            return res.status(400).json({
                error: "Error uploading avatar image",
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

//===================sign in===================

export const signIn = async (req, res) => {
    try {
        const { email, password, registrationNumber } = req.body;
        const user = await userModel.findOne({
            $or: [{ email }, { registrationNumber }],
        });

        if (!user) {
            console.log("No user found");
            return res.status(400).json({
                error: "No user found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid credentials",
            });
        }

        const token = generateToken(user._id);


        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000,
            path: '/'
        };

        res
            .status(200)
            .cookie("access_token", token, cookieOptions)
            .json({
                message: "User signed in successfully",
                token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    registrationNumber: user.registrationNumber,
                    avatar: user.avatar,
                },
            });
    } catch (error) {
        console.error("Sign in error:", error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
