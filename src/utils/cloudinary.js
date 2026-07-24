import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { fileURLToPath } from 'url';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFileUrl) => {
  try {
    //check if file exists
    if(!localFileUrl) return null;
    //uploading the file on cloudinary
    const response = await cloudinary.uploader.upload(localFileUrl, {
      resource_type: "auto"
    })
    //message upon successful upload
    console.log("file has been uploaded: ", + response.url);
    return response;

  } catch (error) {
    fs.unlinkSync(localFileUrl) //removes the locally saved temporary file upon failed upload
    console.log(error)
    return null
  }
}
