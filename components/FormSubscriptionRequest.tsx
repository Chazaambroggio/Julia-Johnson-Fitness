'use client'
import { SessionInterface, SubscriptionInterface, SubscriptionRequestInterface } from '@/common.types';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'

type Props = {
    session: SessionInterface;
    subscriptionPlan: SubscriptionInterface;
}

const FormSubscriptionRequest = ({session, subscriptionPlan}: Props) => {
    
    const router = useRouter();
    const [counter, setCounter] = useState(1);
    const [currentQuestion, setcurrentQuestion] = useState(
        {   
            _id: subscriptionPlan.questionnaire[0]._id,
            title: subscriptionPlan.questionnaire[0].title,
            question: subscriptionPlan.questionnaire[0].question,
            answer:'',
        }
    );
    // const [ form, setForm] = useState<QuestionInterface[]>([]);

    const [subscriptionRequestForm, setSubscriptionRequestForm] = useState<SubscriptionRequestInterface>({
        userId: session?.user?.id,
        subscriptionPlanId: subscriptionPlan?._id,
        trainerId: subscriptionPlan?.trainerId,
        questionnaireAnswer: [],
    })

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormCompleted, setIsFormCompleted] = useState(false);

    function handleNext(){
        setCounter(counter + 1 )

        // Append currentQuestion to the form array
        setSubscriptionRequestForm((prevForm) => ({
            ...prevForm,
            questionnaireAnswer: [
              ...prevForm.questionnaireAnswer,
              {
                _id: currentQuestion._id,
                title: currentQuestion.title,
                question: currentQuestion.question,
                answer: currentQuestion.answer,
              },
            ],
          }));

        // Update currentQuestion to the next question
        if (counter <= subscriptionPlan.questionnaire.length) {
            setcurrentQuestion({
                _id: subscriptionPlan.questionnaire[counter]._id,
                title: subscriptionPlan.questionnaire[counter].title,
                question: subscriptionPlan.questionnaire[counter].question,
                answer: '',
            });
        }

    }

    function handleAnswerChange(newAnswer : string) {
        setcurrentQuestion((prevQuestion) => ({
            ...prevQuestion,
            answer: newAnswer,
        }));
    }
        

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Append last question's answer.
        setSubscriptionRequestForm((prevForm) => ({
            ...prevForm,
            questionnaireAnswer: [
              ...prevForm.questionnaireAnswer,
              {
                _id: currentQuestion._id,
                title: currentQuestion.title,
                question: currentQuestion.question,
                answer: currentQuestion.answer,
              },
            ],
          }));

        try{
            // Make a POST request to the API endpoint on the server-side
            const response = await axios.post('/api/subscriptionRequest/submit', {
                subscriptionRequestForm: subscriptionRequestForm,
                session: session,
            });
 
            setIsFormCompleted((prevState) => !prevState);
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Showing user temporary "Thank you" message
    // and then,redirecting.
    useEffect(() => {
        if (isFormCompleted) {
            
            const timeoutId = setTimeout(() => {
              router.push(`/user/${session?.user?.id}`); 
            }, 4000); // 5000 milliseconds (5 seconds)
      
            // Clear the timeout if the component unmounts before 5 seconds
            return () => {
              clearTimeout(timeoutId);
            };
          }
    }, [isFormCompleted])
    

  return (
    <section className='flex flex-col justify-center items-center self-center max-w-[1024px] w-full gap-8'>
        {!isFormCompleted 
        ? (
            <form 
                onSubmit={handleFormSubmit}
                className='flex flex-col gap-4'
                >
                {currentQuestion && (
                    <>
                    <div 
                        className='flex flex-col mt-32 bg-white border border-slate-200 px-4 py-8 rounded-md gap-2 shadow-xl'
                        key={currentQuestion.title}
                        >
                        <h2 className='text-lg font-semibold'>{currentQuestion.title}</h2>
                        <p className=''> {currentQuestion.question}</p>
                        <textarea 
                            placeholder='Type you response here...'
                            value={currentQuestion.answer}
                            required={true}
                            className="w-full outline-0 p-2 text-base border rounded-lg"
                            onChange={(e) => handleAnswerChange(e.target.value)}

                        />
                    </div>
                    {counter && (
                        <div className='flex w-full justify-end'>
                            <span className='text-slate-400'>{counter} / {subscriptionPlan.questionnaire.length}</span>
                        </div>

                    )}
                    </>
                )}

                {currentQuestion.answer && (
                    <>
                        {(counter == subscriptionPlan.questionnaire.length)
                            ?   (
                                <Button
                                    title='Submit'
                                    type='submit'
                                />
                                
                            ) : (
                                <Button
                                    title='Next'
                                    type='button'
                                    handleClick={handleNext}
                                />
                            )
                        }
                    </>
                )}
            </form>
        ): (
            <div className='flex flex-col mt-32 px-4 py-8 rounded-lg border border-slate-300/50 gap-2'>
                <span className='text-xl font-semibold text-blue-600 text-center'> Thank you!</span>
                <p> Your trainer will get in touch via email to review your request and schedule a call. Stay tuned for your inbox! </p>
            </div>
        )}

    </section>
  )
}

export default FormSubscriptionRequest