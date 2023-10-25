import { QuestionInterface, SubscriptionRequestInterface } from "@/common.types";



export const convertSubscriptionRequestToPlainData = async ( 
    request: SubscriptionRequestInterface
    ) => {

    const painData = {
        _id: request?._id?.toString(),
        userId: request?.userId.toString(),
        trainerId: request?.trainerId.toString(),
        subscriptionPlanId: request?.subscriptionPlanId.toString(),
        status: request?.status,
        createdAt: request?.createdAt,
        completedAt: request?.completedAt,
        canceledAt: request?.canceledAt,
        questionnaireAnswer: request?.questionnaireAnswer.map((answer : QuestionInterface) => ({
            _id: answer?._id?.toString(),
            title: answer?.title,
            question: answer?.question,
            answer: answer?.answer,
                }))
        }

    return painData;

}
