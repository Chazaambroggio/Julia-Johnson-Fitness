import { SubscriptionRequestInterface } from "@/common.types";
import SubscriptionPlan from "@/models/subscriptionPlan";
import SubscriptionRequest from "@/models/subscriptionRequest";
import User from "@/models/user";

export const subscriptionRequestSubmit = async (subscriptionRequestForm: SubscriptionRequestInterface, userId: string) => {

    try {
        const NewSubscriptionRequest = new SubscriptionRequest(subscriptionRequestForm);

        const savedSubscriptionRequest = await NewSubscriptionRequest.save();
        return savedSubscriptionRequest;

    } catch (error) {
        console.error('Error saving subscription request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchUserSubscriptionRequest = async(
    userId: string, 
    status?: 'pending' | 'completed' | 'canceled'
    ) => {

    try {
        if (status) {
            const userSubscriptionRequest = await SubscriptionRequest.find(
                {
                    userId: userId,
                    status: status
                }
            )
            return userSubscriptionRequest;
        } else {
            const userSubscriptionRequest = await SubscriptionRequest.find(
                {
                    userId: userId
                }
            )
            return userSubscriptionRequest;
        }

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchUserLatestSubscriptionRequest = async(
    userId: string, 
    status?: 'pending' | 'completed' | 'canceled'
    ) => {

    try {
        if (status) {
            const userSubscriptionRequest = await SubscriptionRequest.findOne(
                {
                    userId: userId,
                    status: status
                }
            )
            return userSubscriptionRequest;
        } else {
            const userSubscriptionRequest = await SubscriptionRequest.findOne(
                {
                    userId: userId
                }
            )
            return userSubscriptionRequest;
        }

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchTrainerSubscriptionRequest = async(trainerId: string, status: string) => {
    try {
        const trainerSubscriptionRequest = await SubscriptionRequest.find({trainerId: trainerId, status: status})
        return trainerSubscriptionRequest;

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchSubscriptionDetailsForPayment = async(userId: string) => {

    try {
        const userSubscriptionRequest = await SubscriptionRequest.findOne({userId: userId, status: 'pending'})
        
        if (!userSubscriptionRequest) {
            // No pending subscription request found
            return null;
          }
        
        const subscriptionId = userSubscriptionRequest.subscriptionPlanId;

        const subscriptionPlan = await SubscriptionPlan.findById(subscriptionId);

        if (!subscriptionPlan) {
        // Subscription plan not found
        return null;
        }

        const { title, price } = subscriptionPlan;

        return {
            subscriptionId,
            title,
            price,
        };

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const fetchSubscriptionRequest = async(subscriptionRequestId : string) => {
    try {
        const userSubscriptionRequest = await SubscriptionRequest.findById(subscriptionRequestId)
        return userSubscriptionRequest;
    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export const markCompletedSubscriptionRequest =  async(email : string) => {

    try {
        const user = await User.findOne({email: email})
        
        if(!user){
            return null;
        }
        
        const userSubscriptionRequest = await SubscriptionRequest.findOne({
            userId: user._id,
            status : 'pending'
        }).sort({ createdAt: -1 })
        
        if (!userSubscriptionRequest) {
            return null;
        }
            
        userSubscriptionRequest.status = 'completed'
        userSubscriptionRequest.completedAt = new Date().toISOString().split('T')[0]
        userSubscriptionRequest.save();

        return userSubscriptionRequest;

    } catch (error) {
        console.error('Error saving workout:', error);
        throw error; // Re-throw the error to be handled by the caller
    }

}

export const markCanceledSubscriptionRequest =  async(userId: string) => {

    try {

        const userSubscriptionRequest = await SubscriptionRequest.findOne({
            userId: userId,
            status : 'pending'
        }).sort({ createdAt: -1 })
        
        if (!userSubscriptionRequest) {
            return null;
        }

        userSubscriptionRequest.status = 'canceled'
        userSubscriptionRequest.canceledAt = new Date().toISOString().split('T')[0]
        userSubscriptionRequest.save();

        return userSubscriptionRequest;

    } catch (error) {
        
    }

}