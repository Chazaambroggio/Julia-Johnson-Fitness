import User from "@/models/user";


export const fetchAllUsers = async(id: string) =>{
    try {
        const allUsers = await User.find({ role: 'client' });
        return allUsers;

    } catch (error) {
        console.log('Error fetching all users', error);
        throw error;
    }
}

export const fetchUsers = async(trainerId: string , type: 'paid' | 'free' | null) => {

    try {
        if (type == 'paid') {
            const paidUsers = await User.find({
                role: 'client',
                $and: [
                    { subscriptionId: { $ne: null } },
                    { subscriptionId: { $ne: '' } },
                  ],
              });
          
              return paidUsers;

        } else if (type == 'free') {
            const freeUsers = await User.find({
                role: 'client',
                subscriptionId: { $in: [null, ''] },
              });
          
              return freeUsers;
        } else {
            const allUsers = await User.find({ role: 'client' });
            return allUsers;
        }

    } catch (error) {
        console.log('Error fetching users: ', error);
        throw error;
    }
}

export const fetchUser = async(id: string) =>{
    try {
        const user = await User.findById(id);
        return user;

    } catch (error) {
        console.log('Error fetching user', error);
        throw error;
    }
}


export const updateUserSubscription = async(email: string, stripeSubscriptionId: string) => {

    try {
        const user = await User.findOne({email: email});
        if (!user) {
            // User plan not found
            return null;
            }
        user.subscriptionId = stripeSubscriptionId;
        user.save(); 

    } catch (error) {
        console.error('Error update user stripe subscription id:', error);
        throw error; // Re-throw the error to be handled by the caller
    }

}

export const cancelUserSubscription = async(stripeSubscriptionId: string) => {

    try {
        const user = await User.findOne({'subscriptionId' : stripeSubscriptionId})
        if (!user) { return null; }
        
        user.subscriptionId = null;
        user.save();

    } catch (error) {
        
    }
}