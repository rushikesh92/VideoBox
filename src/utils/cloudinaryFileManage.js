import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs' //file system
import { extractPublicId } from 'cloudinary-build-url'

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

        const publicId = extractPublicId(url);

        let resourceType = "image";
        if (url.includes("/video/")) resourceType = "video";
        else if (url.includes("/raw/")) resourceType = "raw";

        const res = await cloudinary.uploader.destroy(publicId,  { resource_type: resourceType});
        // console.log("Delete result: ", publicId  , " : " , res )
        return res;
        
    } catch (error) {
        console.log("Error: failed file delete from cloudinary : " + error.message);
        return null;
    }
}

export {uploadOnCloudinary , deleteFromCloudinary}