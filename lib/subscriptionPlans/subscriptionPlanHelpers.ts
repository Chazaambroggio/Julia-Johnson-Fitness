import { QuestionInterface, SubscriptionInterface } from "@/common.types";


export const convertSubscriptionPlanToPlainData = async ( 
    plan: SubscriptionInterface
    ) => {
    const plainData = {
        _id: plan?._id.toString(),
        trainerId: plan?.trainerId.toString(),
        title: plan?.title,
        price: plan?.price,
        benefits: plan?.benefits,
        frequency: plan?.frequency,
        questionnaire: plan?.questionnaire.map((question : QuestionInterface) => ({
        _id: question?._id?.toString(),
        title: question?.title,
        question: question?.question,
            }))
    }

    return plainData;


}