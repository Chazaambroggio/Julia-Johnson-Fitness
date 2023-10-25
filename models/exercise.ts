import { Schema, model, models } from 'mongoose';

const ExerciseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Exercise title is required!'],
    },
    instructions: {
        type: String,
    },
    coverImage: {
        public_id: String,
        link: String,
    },
    video: {
        public_id: String,
        link: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    }
})

const Exercise = models.Exercise || model("Exercise", ExerciseSchema);

export default Exercise;