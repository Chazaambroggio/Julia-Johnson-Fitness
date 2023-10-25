import { UserInterface } from "@/common.types";



export const convertUserToPlainData = async ( user : UserInterface ) => {
    const plainData = {
        _id: user?._id.toString(),
        username: user?.username,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        role: user?.role,
        subscription: user?.subscription,
        subscriptionId: user?.subscriptionId?.toString()
    }

    return plainData;
}