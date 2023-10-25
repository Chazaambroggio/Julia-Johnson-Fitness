import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
  });

export async function POST(request: Request) {

    const { path, public_id } = await request.json();

    if(!path) {
        return NextResponse.json(
            {message: 'Video path is required'},
            {status: 400}
        )
    }

    try {
        let result;
        if (public_id) {
            
            result = await cloudinary.uploader.upload(path, {
                resource_type: 'video',
                chunk_size: 6000000,
                public_id: public_id,
            });
            
        } else {
            result = await cloudinary.uploader.upload(path, {
                resource_type: 'video',
                chunk_size: 6000000,
            });
        }

        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error}, {status: 500})
    }
}