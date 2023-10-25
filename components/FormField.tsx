import React from 'react';

type Props = {
    type?: string;
    title?: string;
    state: string | number;
    placeholder: string;
    isRequired?: boolean;
    isTextArea?: boolean;
    setState: (value:string) => void; // Function that accepts a string and doesn't return anything
    titleCSS?: string;
    inputCSS?: string;

}

const FormField = ({type, title, state, placeholder, isRequired, isTextArea, setState, titleCSS, inputCSS} : Props) => {
  return (
    <div className="flex flex-col justify-start items-center w-full">
        {title && (
            <label className={`w-full text-gray-600 ${titleCSS}`}>
                {title}
            </label>
        )}

        {isTextArea ? (
            <textarea 
                placeholder={placeholder}
                value={state}
                required={isRequired}
                className={`w-full outline-0 p-2 text-base border rounded-lg ${inputCSS}`}
                onChange={(e) => setState(e.target.value)}
            />
        ) : (
            <input 
                type={type || 'text'}
                placeholder={placeholder}
                value={state}
                required={isRequired}
                className={`w-full text-base p-2 border rounded-lg ${inputCSS}`}
                onChange={(e) => setState(e.target.value)}
            />
        )}
    </div>
  )
}

export default FormField