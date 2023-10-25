import { Schema, model, models } from 'mongoose';

const WorkoutSchema = new Schema({
    workout_name: {
        type: String,
        required: [true, 'Exercise title is required!'], 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    },
    exercises: [{
        exerciseId: { 
            type: Schema.Types.ObjectId,
            ref: 'Exercise', // Reference the 'Exercise' model
        },
        sets: Number,
        reps: String,
        weight: Number,
    }]
    ,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    }
})

const Workout = models.Workout || model("Workout", WorkoutSchema);

export default Workout;