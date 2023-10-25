import { CompletionHistoryInterface, WorkoutInterface } from "@/common.types";
import completionHistory from "@/models/completionHistory";
const {ObjectId} = require('mongodb');




export const logExercise = async (userId: string, workout: WorkoutInterface,  exerciseId: string, completedAt: string) => {

    try {
        const today = new Date(completedAt);
        const currentTime = new Date();

        const workoutLogExist = await completionHistory.findOne({user: userId, date: today, workout: workout?._id}) as CompletionHistoryInterface;

        if (!workoutLogExist) {
            // Create new log record.
            const newWorkoutLog = new completionHistory({
                user: userId,
                workout: workout?._id,
                workout_length: workout?.exercises.length,
                exercises: [{ exerciseId: exerciseId, time: currentTime }],
                date: today // Extract date in "YYYY-MM-DD" format
            })
            
            // Save the exercise to the database
            const savedNewWorkoutLog = await newWorkoutLog.save()            
            return savedNewWorkoutLog;

        } else {
            // update 
            const loggedExercise = await completionHistory.findByIdAndUpdate(workoutLogExist?._id, 
                {
                    $push: {
                        exercises: { exerciseId: exerciseId, time: currentTime },
                    }
                }, 
                { new: true }
            );
            
            // Update isComplete field based on the current state
            loggedExercise.isComplete = loggedExercise.workout_length === loggedExercise.exercises.length;
            await loggedExercise.save(); 

            return loggedExercise;
        } 

    } catch (error) {
        throw new Error('Loggin exercise failed'); // Throw an error if image upload fails
    }
}

export const removeLogExercise = async (userId: string, workout: WorkoutInterface,  exerciseId: string, completedAt: string) => {
   
    try {
        const today = new Date(completedAt);

        const workoutLogExist = await completionHistory.findOne( 
            {
                user: userId, 
                workout: workout?._id,
                date: today 
            }) as CompletionHistoryInterface;

        if (workoutLogExist) {
            // Remove the exercise from the exercises array
            const updatedWorkoutLog = await completionHistory.findByIdAndUpdate( 
                workoutLogExist?._id,
                {
                    $pull: { exercises: { exerciseId: exerciseId } },
                },
                { new: true }
            );

            // Update isComplete field based on the current state
            updatedWorkoutLog.isComplete = updatedWorkoutLog.workout_length === updatedWorkoutLog.exercises.length;
            await updatedWorkoutLog.save(); 

            return updatedWorkoutLog;
            
        } else {
            throw new Error('Workout log does not exist');
        }

    } catch (error) {
        throw new Error('Loggin exercise failed'); // Throw an error if image upload fails
    }
}


export const fetchLatestWorkoutLog = async(userId: string, workoutId: string) => {

    const latestWorkoutLog = await completionHistory
        .findOne({ user: userId, workout: workoutId })
        .sort({ date: -1 }) // Sort in descending order
        .limit(1) as CompletionHistoryInterface;
    
    if (latestWorkoutLog) { 
        return latestWorkoutLog;
    }
}

export const fetchLatestUserWorkoutLog = async(userId: string) => {

    const latestWorkoutLog = await completionHistory
        .findOne({ user: userId })
        .sort({ date: -1 }) // Sort in descending order
        .limit(1) as CompletionHistoryInterface;
    
    if (latestWorkoutLog) { 
        return latestWorkoutLog;
    }
}

export const fetchUserCompleteWorkouts = async(userId: string) => {
    const completedWorkouts = await completionHistory.countDocuments({ 
        user: userId,
        isComplete: true,
    });
    return completedWorkouts;
}



export const fetchUserCompleteExercises = async(userId: string) => {

    try {
        const completedExercises = await completionHistory.aggregate([
            {  
                $match: {
                    user: new ObjectId(userId), // Replace with the user's ObjectId
                }
            },
            {
                $unwind: { 
                    path: "$exercises"
                }
            },
            {
    
                $count: 'count', // Count exercises
    
            },
          ]);
    
        return completedExercises[0].count;
        
    } catch (error) {
        return 0
    }
}

export const fetchUserActiveDays = async(userId: string) => {
    const activeDays = await completionHistory.countDocuments({ user: userId});
    return activeDays;
}
