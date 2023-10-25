import React, { MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {
    iconName: 'faPlusCircle';
    handleClick: MouseEventHandler;
}

const ButtonFloatingIcon = ({iconName, handleClick} : Props) => {

  return (
    <div className='flex justify-center w-full min-h-[10] m-4'>
        {iconName == 'faPlusCircle' && (
            <FontAwesomeIcon  
                icon={faPlusCircle as IconProp} 
                className={`w-full min-h-[10] text-3xl text-blue-700 ease-in duration-300 cursor-pointer`}
                onClick={handleClick}
            />
        )}
    </div>
  )
}

export default ButtonFloatingIcon