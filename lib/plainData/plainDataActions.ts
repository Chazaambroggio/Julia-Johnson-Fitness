import { CompletionHistoryInterface, UserInterface } from "@/common.types";


export const converUserWorkoutLogToPlainData = async( 
    user: UserInterface, 
    workoutLog?: CompletionHistoryInterface, 
    isUserInPendingRequests?: boolean ) =>{
    
    return {
        _id: user?._id.toString(),
        username: user?.username,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        role: user?.role,
        subscription: user?.subscription,
        subscriptionId: user?.subscriptionId,
        lastActiveDate: workoutLog?.date, // Include the last active date
        pendingRequest: isUserInPendingRequests,
    };

}

