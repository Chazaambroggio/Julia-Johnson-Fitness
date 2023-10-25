'use client'

import { useCallback, useRef, ReactNode, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';


const Modal = ({ children, handleToggleModal } : { children: ReactNode, handleToggleModal: MouseEventHandler }) => {

    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    

    const handleClick = useCallback((e: React.MouseEvent) => {
        if(e.target === overlay.current) {
            handleToggleModal(e)
        }
    }, [ overlay]);

  return (
    <div ref={overlay} className='fixed flex justify-centr items-center z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80' onClick={handleClick}>

        <button type='button' onClick={handleToggleModal} className='absolute top-2 right-8 md:top-4'>
            <FontAwesomeIcon
                icon={faX}
                className='text-xl text-slate-50 rounded-full '
            /> 
        </button>


        <div ref={wrapper} className='flex flex-col justify-start items-center mx-auto h-[90%] w-[95%] bg-white rounded-3xl lg:px-40 px-8 pt-14 pb-44 overflow-auto'>
            {children}
        </div>
    </div>
  )
}

export default Modal