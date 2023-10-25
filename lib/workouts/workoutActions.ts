import { WorkoutInterface } from "@/common.types";
import Exercise from "@/models/exercise";
import Workout from "@/models/workout";

export const createWorkout = async(form: WorkoutInterface, creatorId: string) => {
    
    try {
        const NewWorkout = new Workout({
            workout_name: form?.workout_name,
            user: form?.user,
            exercises: form?.exercises,
            createdBy: form?.createdBy,
            isFree: form?.isFree,
        });

        const savedWorkout = await NewWorkout.save();
        return savedWorkout;

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const updateWorkout = async(form: WorkoutInterface, creatorId: string) => {

    try {
        const updatedExercise = await Workout.findByIdAndUpdate(form._id, form)
        return updatedExercise;

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}


export const deleteWorkout = async (id: string, creatorId: string) => {
    try {
        // Find the exercise by its ID
        const workout = await Workout.findById(id);

        if (!workout) {
            throw new Error('Workout not found');
        }
 
        if (workout.createdBy.toString() !== creatorId) {
            throw new Error('Unauthorize action');
        }

        // Delete the workout from the database
        const response = await Workout.findByIdAndDelete(id);
        return response;

    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchUserWorkouts = async(userId: string) =>{

    let userWorkouts;
    try {
        
        userWorkouts = await Workout.find({
            user: userId,
            isFree: { $ne: true },
        });
        
        return userWorkouts;

    } catch (error) {
        console.log('Error fetching all workouts', error);
        throw error;
    }
}

export const fetchFreeWorkouts = async(userId: string) =>{
    try {
        const userWorkouts = await Workout.find({
            // user: userId,
            isFree: true,
        });
        return userWorkouts;

    } catch (error) {
        console.log('Error fetching all workouts', error);
        throw error;
    }
}


export const fetchWorkout = async ( id: string ) => {
    try {
        const workout = await Workout.findById(id);
        return workout;
    } catch (error) {
        console.log('Error fetching workout', error);
        throw error;
    }
}

export const countPaidWorkouts = async ( userId: string ) => {
    try {
        const count = await Workout.countDocuments({user: userId, isFree: false});
        return count;
    } catch (error) {
        console.log('Error fetching workout', error);
        throw error;
    }
}


export const fetchWorkoutExercises = async ( workoutId: string ) => {
    try {
        const workout = await Workout.findById(workoutId).populate('exercises');
        if (!workout) {
            throw new Error("Workout's exercises not found");
        }
        
        type Exercises = {
            exerciseId: string;
            sets: number;
            reps: number;
          }
        // Fetch exercise details using the exercise IDs from the workout's exercises array
        const exerciseDetailsPromises = workout.exercises.map(async (exercise : Exercises) => {
            return Exercise.findById(exercise.exerciseId);
        });

        const exerciseDetails = await Promise.all(exerciseDetailsPromises);
        return exerciseDetails;
    } catch (error) {
        console.log("Error fetching workout's exercise", error);
        throw error;
    }
}