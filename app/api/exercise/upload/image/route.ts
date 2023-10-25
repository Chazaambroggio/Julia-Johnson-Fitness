import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
  });

export async function POST(request: Request) {

    const { path, public_id  } = await request.json();

    if(!path) {
        return NextResponse.json(
            {message: 'Image path is required'},
            {status: 400}
        )
    }

    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transform: [{ 
                width: 1000, 
                height: 1000,
                quality: 'auto', 
                crop: 'fill', 
                fetch_format: 'auto'
            }] //scale, fill  height: 740
        }
        

        const uploadOptions = public_id ? { ...options, public_id } : options;  // Send public_id when updating an image.
        const result = await cloudinary.uploader.upload(path, uploadOptions);

        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500})
    }
}