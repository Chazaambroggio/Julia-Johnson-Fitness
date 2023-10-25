import { Session } from 'next-auth';

export interface SessionInterface extends Session {
    user: {
        id: string
        username: string;
        email: string;
        avatarUrl: string;
        role: string;
        subscription: string;
        subscriptionId: string;
    }
}
export interface UserProfile {
    _id: string,
    username: string;
    email: string;
    avatarUrl: string;
    role: string;
    subscription: string;
    subscriptionId?: string;
    lastActiveDate?: Date;
    pendingRequest?: boolean;
}

export interface UserInterface {
    _id: string,
    username: string;
    email: string;
    avatarUrl: string;
    role: string;
    subscription: string;
    subscriptionId?: string;
}

export interface ExerciseInterface {
    _id: string;
    title: string;
    instructions: string;
    coverImage: {
        public_id: string;
        link: string;
    }
    video: {
        public_id: string;
        link: string;
    }
    createdBy: string;
}

export interface WorkoutInterface {
    _id : string;
    workout_name: string;
    user: string;
    exercises: {
        exerciseId: string;
        sets: number;
        reps: string;
        weight: number;
    }[];
    createdBy: string;
    isFree: Boolean;
    lastActiveDate?: Date;
    isComplete?: boolean;
}

export interface CompletionHistoryInterface {
    _id: string;
    user: string;
    date: Date;
    workout: string;
    workout_length: Number;
    exercises: {
        exerciseId: string,
        time: Date,   
    }[];
    isComplete: boolean;
}

export interface WorkoutExerciseInterface {
    exerciseId: string;
    sets: number;
    reps: string;
    weight: number;
  }

export interface SubscriptionPlan {
    subscriptionId: string;
    title: string,
    price: number,
    benefits: string[], 
}

export interface SubscriptionInterface {
    _id: string,
    trainerId: string,
    title: string,
    price: number,
    benefits: string[],
    frequency: string,
    questionnaire: QuestionInterface[],

}

export interface QuestionInterface {
    _id?: string,
    title: string,
    question: string,
    answer?: string,
}

export interface SubscriptionRequestInterface {
    _id?: string,
    userId: string,
    trainerId: string,
    subscriptionPlanId: string,
    questionnaireAnswer: QuestionInterface[],
    status?: 'pending' | 'completed' | 'canceled',
    createdAt?: Date,
    completedAt?: Date,
    canceledAt?: Date,
}