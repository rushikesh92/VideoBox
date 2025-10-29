import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs' //file system

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath ) return null;
        const res = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        // console.log("File uploaded on cloudinary : " + res.url);
        fs.unlinkSync(localFilePath);//removes locally stored temp file
        return res;

    } catch (error) {
        console.log("Error: failed file upload on cloudinary : " + error.message);
        fs.unlinkSync(localFilePath);//removes locally stored temp file
        return null;
    }
}

const deleteFromCloudinary = async (url) =>{
    try {
        if(!url) return null;

        //url format : https://res.cloudinary.com/demo/image/upload/publicId.jpg

        const publicId = url.split("/").slice(-1)[0].split(".")[0];
        const res = await cloudinary.uploader.destroy(publicId);
        // console.log("delete", publicId  , " : " , res )
        return res;
        
    } catch (error) {
        console.log("Error: failed file delete from cloudinary : " + error.message);
        return null;
    }
}

export {uploadOnCloudinary , deleteFromCloudinary}