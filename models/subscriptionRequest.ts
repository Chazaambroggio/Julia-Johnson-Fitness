import { Schema, model, models } from 'mongoose';

const SubscriptionRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    },
    subscriptionPlanId: {
        type: Schema.Types.ObjectId,
        ref: 'SubscriptionPlan', // Reference the 'User' model
    },
    trainerId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' model
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'canceled'],
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString().split('T')[0],
    },
    completedAt: {
        type: Date,
    },
    canceledAt: {
        type: Date,
    },
    questionnaireAnswer: [{
        title: String,
        question: String,
        answer: String,
    }],
})

const SubscriptionRequest = models.SubscriptionRequest || model("SubscriptionRequest", SubscriptionRequestSchema);

export default SubscriptionRequest;