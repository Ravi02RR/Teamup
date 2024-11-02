export const env = {
    db: {
        uri: process.env.MONGO_URI 
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET

    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    bcrypt:{
        salt: parseInt(process.env.SALT_ROUNDS)
    }

}

// console.log(env)