import { SubscriptionInterface } from "@/common.types";
import SubscriptionPlan from "@/models/subscriptionPlan";


export const createNewSubscriptionPlan = async (form: SubscriptionInterface, creatorId: string) => {

    try {
        const NewSubscriptionPlan = new SubscriptionPlan({
            trainerId: form?.trainerId,
            title: form?.title,
            price: form?.price,
            benefits: form?.benefits,
            frequency: form?.frequency,
            questionnaire: form?.questionnaire,
        });

        const savedSubscriptionPlan = await NewSubscriptionPlan.save();
        return savedSubscriptionPlan;

    } catch (error) {
        console.error('Error saving subscription plan:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}


export const deleteSubscriptionPlan = async (subscriptionPlanId: string, creatorId: string) => {
    try {
        // Find the exercise by its ID
        const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);

        if (!subscriptionPlan) {
            throw new Error('SubscriptionPlan not found');
        }
 
        if (subscriptionPlan.trainerId.toString() !== creatorId) {
            throw new Error('Unauthorize action');
        }

        // Delete the subscriptionPlan from the database
        const response = await SubscriptionPlan.findByIdAndDelete(subscriptionPlanId);
        return response;

    } catch (error) {
        console.error('Error deleting exercise:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}


export const updateSubscriptionPlan = async(form: SubscriptionInterface, creatorId: string) => {

    try {
        const updatedSubscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(form._id, form)
        return updatedSubscriptionPlan;

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchAllSubscriptionPlans = async () => {
    try {
        const allSubscriptionPlans = await SubscriptionPlan.find();
        return allSubscriptionPlans;

    } catch (error) {
        console.log('Error fetching all exercises', error);
        throw error;
    }
}

export const fetchTrainerSubscriptionPlans = async (trainerId: string) => {
    try {
        const allSubscriptionPlans = await SubscriptionPlan.find({ trainerId: trainerId });
        return allSubscriptionPlans;

    } catch (error) {
        console.log('Error fetching all exercises', error);
        throw error;
    }
}

export const fetchSubscriptionPlan = async (subscriptionPlanId: string) => {
    try {
        const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
        return subscriptionPlan;

    } catch (error) {
        console.log('Error fetching all exercises', error);
        throw error;
    }
}
