import Exercise from "@/models/exercise";
import { deleteCloudinaryAsset, uploadImage, uploadVideo } from "../cloudinary/cloudinaryActions";
import { ExerciseInterface } from "@/common.types";



// Create new exercise and save it to database.
export const createNewExercise = async (form: ExerciseInterface, creatorId: string) => {
    try {        
        // Upload to Cloudinary
        const imageUrl = await uploadImage(form.coverImage.link);
        const videoUrl = await uploadVideo(form.video.link);

        if(imageUrl?.secure_url && videoUrl?.secure_url) {      

            const newExercise = new Exercise({
                title: form?.title as string,
                instructions: form?.instructions as string,
                coverImage: {
                    public_id: imageUrl?.public_id as string,
                    link: imageUrl?.secure_url as string,
                    },
                video: { 
                    public_id: videoUrl?.public_id as string,
                    link: videoUrl?.secure_url as string,
                    },
                createdBy: creatorId as string
            });

            // Save the exercise to the database
            const savedExercise = await newExercise.save();
            return savedExercise;
            
        } else {
        throw new Error('Image upload failed'); // Throw an error if image upload fails
        }
    
    } catch (error) {
        console.error('Error saving exercise:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}



export const deleteExercise = async (id: string, creatorId: string) => {
    try {
        // Find the exercise by its ID
        const exercise = await Exercise.findById(id);

        if (!exercise) {
            throw new Error('Exercise not found');
        }
 
        if (exercise.createdBy.toString() !== creatorId) {
            throw new Error('Unauthorize action');
        }

        // Delete exercise resources from Cloudinary
        await deleteCloudinaryAsset(exercise?.coverImage?.public_id , "image");
        await deleteCloudinaryAsset(exercise?.video?.public_id, "video"); 

        // Delete the exercise from the database
        await Exercise.findByIdAndDelete(id);

        return exercise;

    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const updateExercise = async (form: ExerciseInterface, creatorId: string) => {

    function isBase64DataUrl(value: string) {
        const base64ImageRegex = /^data:image\/[a-z]+;base64,/;
        const base64VideoRegex = /^data:video\/mp4;base64,/;

        return base64ImageRegex.test(value) || base64VideoRegex.test(value);
    }

    let updatedForm = {...form};
    
    const isUploadingNewImage = isBase64DataUrl(form.coverImage.link);
    const isUploadingNewVideo = isBase64DataUrl(form.video.link);

    try {
        if (isUploadingNewImage) {
            let imageUrl;
            // If there's a cover image, upload or update it
            if (form.coverImage.link && form.coverImage.public_id) {
                imageUrl = await uploadImage(form.coverImage.link, form.coverImage.public_id);

            } else {
                imageUrl = await uploadImage(form.coverImage.link);
            }

            if (imageUrl.secure_url) {
                updatedForm = {
                    ...updatedForm,
                    coverImage: {
                        ...updatedForm.coverImage, 
                        link: imageUrl.secure_url 
                    }
                }
            }
        }

       
        if (isUploadingNewVideo) {

            let videoUrl; 
            if (form.video.link && form.video.public_id) {
                videoUrl = await uploadVideo(form.video.link, form.video.public_id);
            } else {
                videoUrl = await uploadVideo(form.video.link);
            }
            
            if (videoUrl.secure_url) {
                updatedForm = {
                    ...updatedForm,
                    video : {
                        ...updatedForm.video,
                        link: videoUrl.secure_url
                    }
                }
            }
        }
            
        const updatedExercise = await Exercise.findByIdAndUpdate(updatedForm._id, updatedForm)
        if (!updatedExercise) {
            throw new Error('Exercise not found');
        }
      
        return updatedExercise;

    } catch (error) {
        throw new Error('Exercise update failed'); // Throw an error if image upload fails
    }

}

export const fetchExercise = async(id: string) =>{
    try {
        const exercise = await Exercise.findById(id);
        return exercise;

    } catch (error) {
        console.log('Error fetching exercise', error);
        throw error;
    }
}

export const fetchAllExercises = async(id: string) =>{
    try {
        const allExercises = await Exercise.find({ createdBy: id });
        return allExercises;

    } catch (error) {
        console.log('Error fetching all exercises', error);
        throw error;
    }
}