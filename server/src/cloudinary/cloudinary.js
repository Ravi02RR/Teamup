import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "../config/confo.js";


//==================uploading image to cloudinary==================
cloudinary.config({
    cloud_name: env.cloudinary.cloud_name,
    api_key: env.cloudinary.api_key,
    api_secret: env.cloudinary.api_secret,
});
export const uploadOnCloudinary = async (localfile) => {
    try {
        // console.log(obj)
        if (!localfile) {
            return null;
        }
        const result = await cloudinary.uploader.upload(localfile, {
            resource_type: "auto",
        });
        console.log("file uploaded successfully", result);
        fs.unlinkSync(localfile);
        return result;
    } catch (error) {
        fs.unlinkSync(localfile);
        console.log(error);
        return null;
    }
};



// (async function() {

//     // Configuration
//     cloudinary.config({
//         cloud_name: 'dpaefaefvtafaeuoeih',
//         api_key: 'afwfawfdaasfsffw',
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });

//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();