import { ExerciseInterface } from "@/common.types";


export const convertExerciseToPlainData  = async ( exercise : ExerciseInterface ) => {

    const plainData = {
        _id: exercise?._id.toString(),
        title: exercise?.title,
        coverImage: {
            public_id: exercise?.coverImage?.public_id,
            link: exercise?.coverImage?.link,
        }, 
        video: {
            public_id: exercise?.video?.public_id,
            link: exercise?.video?.link,
        },
        instructions: exercise?.instructions,
        createdBy: exercise?.createdBy.toString(),
    }

    return plainData;
}

