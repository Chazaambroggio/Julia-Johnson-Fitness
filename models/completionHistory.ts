import { Schema, model, models } from 'mongoose';

const completionHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        index: true,
    },
    date: { type: Date, index: true },
    workout: {
            type: Schema.Types.ObjectId,
            ref: 'Workout',
            index: true,
        }, 
    workout_length: {
        type: Number,
    },
    exercises: [ {
        exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        time: Date,
        }
    ],
    isComplete: {type: Boolean, default: false},
})

const completionHistory = models.completionHistory || model("completionHistory", completionHistorySchema);

export default completionHistory;