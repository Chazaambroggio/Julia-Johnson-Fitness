'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { QuestionInterface, SessionInterface, SubscriptionInterface } from '@/common.types'
import Button from './Button'
import FormField from './FormField'
import CRUDButton from './ButtonCRUD'

type Props = {
    type: 'create' | 'edit',
    session: SessionInterface,
    subscription?: SubscriptionInterface,
}

const FormSubscription = ({ type, session, subscription} : Props) => {

    // Breakdown the form into 3 parts. 
    // 1 - title, price, billing,
    // 2 - Services included
    // 3 - Questionnaire
    // Submit all together
    // Write the submit functionality of the form

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentBenefits, setCurrentBenefit] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<QuestionInterface>({
        title: '',
        question: '',
    });


    const [form, setForm] = useState<SubscriptionInterface>({
        _id: subscription?._id || '',
        trainerId: subscription?.trainerId || session?.user?.id,
        title: subscription?.title || '',
        price: subscription?.price || 0,
        benefits: subscription?.benefits || [],
        frequency: subscription?.frequency || '', 
        questionnaire: subscription?.questionnaire || [],       
    }); 

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (type === 'create') {

                // Make a POST request to the API endpoint on the server-side
                const response = await axios.post('/api/subscription/create', {
                    form: form,
                    session: session,
                });

                console.log('Subscription plan created successfully:', response.data);
                router.push(`/dashboard/trainer/${session?.user?.id}`);               
            } 

            if (type === 'edit') {
                // Make a PUT request to the API endpoint on the server-side
                const response = await axios.put('/api/subscription/edit', {
                    form: form,
                    session: session,
                });
                console.log('Subscription plan successfully edited:', response.data);
                router.push(`/dashboard/trainer/${session?.user?.id}`);               

            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStateChange = (fieldName: string, value: string, ) => {

        setForm((prevForm) => ({ 
            ...prevForm, 
            [fieldName]: value 
        }));
            
    };
    
    const handleBenefitAdd = () => {
        setIsSubmitting((prevState) => !prevState);
        
        setForm((prevForm) => ({
            ...prevForm,
            benefits: [...prevForm.benefits, currentBenefits],
          }));

        setCurrentBenefit('');
        setIsSubmitting((prevState) => !prevState);
    }

    const handleBenefitRemove = (benefitToRemove : string) => {
        setForm((prevForm) => ({
            ...prevForm,
            benefits: prevForm.benefits.filter((benefit) => benefit !== benefitToRemove),
          }));
    }
    
    const handleQuestionAdd = () => {
        setIsSubmitting((prevState) => !prevState);

        setForm((prevForm) => ({
            ...prevForm,
            questionnaire: [...prevForm.questionnaire, currentQuestion],
          }));

        setCurrentQuestion({
            title:'',
            question: '',
        });
        setIsSubmitting((prevState) => !prevState);
    }

    const handleQuestionRemove = (questionToRemove : QuestionInterface) => {

        setForm((prevForm) => ({
            ...prevForm,
            questionnaire: prevForm.questionnaire.filter((question) => question !== questionToRemove),
          }));
    }

    const handleQuestionChange = (fieldName : string, value: string ) => {
        setCurrentQuestion((prevState) => ({ 
            ...prevState, 
            [fieldName]: value 
        }));
    }

  return (
    <section className='flex flex-col justify-start items-center w-full max-w-screen-md'>
        <h3 className='text-xl font-semibold'>{ type =='create' ? 'Create a Subscription Plan' : `Edit ${form.title}`}</h3>
        
        <form
            onSubmit={handleFormSubmit}
            className='flex flex-col items-center justify-start w-full lg:pt-24 pt-10 gap-4 text-lg mx-auto'
        >
           
                <FormField 
                    title='Title'
                    state={form.title}
                    placeholder="Subscription Title"
                    isRequired={true}
                    setState={(value) => handleStateChange('title', value)}
                /> 

                <FormField 
                    title='Price'
                    state={form.price}
                    placeholder="Price"
                    isRequired={true}
                    setState={(value) => handleStateChange('price', value)}
                /> 

                <FormField 
                    title='Billing Period'
                    state={form.frequency}
                    placeholder="Monthly / Annual"
                    isRequired={true}
                    setState={(value) => handleStateChange('frequency', value)}
                /> 
                
                <div className='flex flex-col w-full'>
                    <label className="w-full text-gray-600">
                        Services Included
                    </label>

                    <div className='flex flex-col w-full p-2 bg-white border rounded'>

                        <ul className='mx-4 list-disc mb-2'>
                            {form.benefits.map((benefit) => (    
                                <div className='flex w-full items-center hover:bg-slate-200 rounded'>

                                    <li 
                                        key={benefit}
                                        className='text-sm w-5/6'
                                        >
                                            {benefit}
                                    </li>
                                    <div className='flex w-1/6 justify-center'>
                                        <FontAwesomeIcon  
                                            icon={faTrash}
                                            className='flex text-sm text-red-600/80 hover:text-red-600 cursor-pointer'
                                            onClick={() => handleBenefitRemove(benefit)}
                                        />
                                    </div>
                                </div>                

                            ))}
                        </ul>
                        
                        <FormField 
                            title='Service'
                            titleCSS='text-sm'
                            state={currentBenefits}
                            placeholder="Detailed exercise instructions and video demonstrations"
                            //isRequired={true}
                            setState={(value) => setCurrentBenefit(value)}
                            /> 
                        {currentBenefits && (
                            <div className='flex w-full justify-end mt-2'>
                                <Button
                                    title='New'
                                    type='button'
                                    bgColor='max-w-[48px] bg-blue-600'
                                    isSubmitting={isSubmitting}
                                    handleClick={handleBenefitAdd}
                                />                
                            </div>
                        )}
                    </div>
                </div>
                        
                <div className='flex flex-col w-full'>
                    <label className="w-full text-gray-600">
                        Questionnaire
                    </label>
                    <div className='flex flex-col w-full p-2 bg-white border rounded'>
                        <ul className='mx-4 list-decimal mb-2'>
                            {form?.questionnaire.map((question) => (    
                                <div className='flex w-full justify-between items-center p-2 rounded-lg'>
                                    <li 
                                        key={question.title}
                                        className='text-sm'
                                        >
                                            <div className='flex flex-col p-2 '>
                                                <span className='font-semibold'>{question.title}</span>
                                                <span className=''>{question.question}</span>
                                            </div>
                                    </li>
                                    <FontAwesomeIcon  
                                        icon={faTrash}
                                        className='flex text-sm text-red-600/80 hover:text-red-600 cursor-pointer'
                                        onClick={() => handleQuestionRemove(question)}
                                    />
                                </div>                

                            ))}
                        </ul>
                        <div className='flex flex-col w-full gap-2'>
                            <FormField 
                                title='Title'
                                titleCSS='text-sm'
                                state={currentQuestion?.title}
                                placeholder="Goal"
                                //isRequired={true}
                                setState={(value) => handleQuestionChange('title', value)}
                                /> 
                            <FormField 
                                title='Question'
                                titleCSS='text-sm'
                                state={currentQuestion?.question}
                                placeholder="What are your short-term and long-term fitness goals"
                                //isRequired={true}
                                setState={(value) => handleQuestionChange( 'question' , value)}
                                /> 

                        </div>
                        {currentQuestion.title.length > 0 && currentQuestion.question.length > 0 && (
                            <div className='flex w-full justify-end mt-2'>
                                <Button
                                    title='New'
                                    type='button'
                                    bgColor='max-w-[48px] bg-blue-600'
                                    isSubmitting={isSubmitting}
                                    handleClick={handleQuestionAdd}
                                />                
                            </div>
                        )}
                    </div>
                </div>

            <div className='flex w-full justify-center items-center gap-8'>
                {type == 'edit' && subscription && (
                    <CRUDButton
                        title='Delete'
                        functionality='delete'
                        element={subscription}
                        elementType='subscription'
                        session={session}
                        bgColor='bg-red-600'
                    />
                )}

                <Button
                    title={isSubmitting 
                        ? `${type === 'create' ? 'Creating' : 'Updating'}`
                        : `${type === 'create' ? 'Create' : 'Update'}`
                        }
                    type='submit'
                    isSubmitting={isSubmitting}
                />

            </div>

        </form>
    </section>
  )
}

export default FormSubscription