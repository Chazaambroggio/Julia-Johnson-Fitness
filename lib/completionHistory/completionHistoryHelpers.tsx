import { CompletionHistoryInterface } from "@/common.types";



export const convertWorkoutCompletionHistoryToPlainData = async ( workoutLog : CompletionHistoryInterface ) => {
    const plainData = {
        _id: workoutLog?._id.toString(),
        user: workoutLog?.user.toString(),
        date: workoutLog?.date,
        workout: workoutLog?.workout.toString(),
        workout_length: workoutLog?.workout_length,
        exercises: workoutLog?.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId.toString(),
            time: exercise.time,
        })),
        isComplete: workoutLog?.isComplete,
    }

    return plainData;
}