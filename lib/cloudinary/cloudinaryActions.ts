import { v2 as cloudinary } from 'cloudinary';


const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
  });



  export const uploadImage = async(imagePath: string, public_id?: string) => {
    try {
        
        const response = await fetch(`${serverUrl}/api/exercise/upload/image`, {
            method: 'POST',
            body: JSON.stringify({path: imagePath, public_id: public_id})
        })

        return response.json();
    } catch (error) {
        throw error;
    }   
}

export const uploadVideo = async(videoPath: string, public_id?: string) => {
    console.log('Upload video Action')
    try {
        const response = await fetch(`${serverUrl}/api/exercise/upload/video`, {
            method: 'POST',
            body: JSON.stringify({path: videoPath, public_id: public_id})
        })

        return response.json();
    } catch (error) {
        throw error;
    }   
}



export const deleteCloudinaryAsset = async(public_id: string, type: string) => {
    try {
        await cloudinary.uploader.destroy(public_id, { resource_type: type })
        return true;
    } catch (error) {
        throw error;
    }   
}

