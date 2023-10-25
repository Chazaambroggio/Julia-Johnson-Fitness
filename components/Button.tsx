'use client'
import React, { MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'; 
import { useRouter } from 'next/navigation';

type Props = {
    title: string;
    bgColor?: string;
    textColor?: string;
    type?: 'button' | 'submit';
    handleClick?: MouseEventHandler;
    isSubmitting?: boolean;
    // buttonRef?: React.RefObject<HTMLButtonElement>;
    googleIcon?: boolean;
    navigateTo?: string;
}


const Button = ({ title, type, handleClick, isSubmitting, bgColor, textColor, googleIcon, navigateTo }: Props) => {
    const router = useRouter()

    
    function handleNavigateTo() {
        router.push(`${navigateTo}`)
    }

    return (
        <button
            type={type || 'button'}
            disabled={isSubmitting}
            className={`flex justify-center items-center gap-3 px-3 py-2
                ${textColor || 'text-white'}
                ${isSubmitting ? 'bg-black-50' : bgColor ? bgColor : 'bg-blue-600'} 
                rounded-xl text-sm font-medium max-md:w-full transition duration-300 ease-out
                `}

            onClick={!navigateTo ? handleClick : handleNavigateTo}

            // ref={buttonRef}
        >
            {googleIcon && (
                <FontAwesomeIcon  
                    icon={faGoogle as IconProp} 
                    className={`text-2xl text-white ease-in duration-300`}
                />
            )}
            {title}
        </button>
    )
}

export default Button