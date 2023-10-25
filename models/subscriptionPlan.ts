import { Schema, model, models } from 'mongoose';

const SubscriptionPlanSchema = new Schema({
    trainerId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    benefits: [],
    frequency: {
        type: String,
    },
    questionnaire: [{
        title: String,
        question: String,
    }],
})

const SubscriptionPlan = models.SubscriptionPlan || model("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;