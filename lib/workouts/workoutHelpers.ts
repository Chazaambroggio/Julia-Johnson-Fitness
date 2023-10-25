import { WorkoutExerciseInterface, WorkoutInterface } from "@/common.types";

export const convertWorkoutToPlainData = async ( workout : WorkoutInterface ) => {
    const plainData = {
        _id: workout?._id.toString(),
          workout_name: workout?.workout_name,
          user: workout?.user.toString(),
          exercises: workout?.exercises.map((exercise : WorkoutExerciseInterface) => ({
            exerciseId: exercise.exerciseId.toString(),
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight
        })),
          createdBy: workout?.createdBy.toString(),
          isFree: workout?.isFree,
    }

    return plainData;
}