'use client';
import { getProviders, signIn } from 'next-auth/react';
import React from 'react'
import { useState, useEffect } from 'react';
import Button from './Button';

type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | null;
}

type Providers = Record<string, Provider>;

const AuthProviders = () => {

    const [providers, setProviders] = useState< Providers | null>(null);

    // Fetching Providers.
    useEffect(() => {
      const fetchProviders = async () => {
        const res = await getProviders();
        setProviders(res);
      }
      fetchProviders();
    }, []);
    
    if (providers)  {
        return (
          <div className='flex w-full justify-center'>
            {Object.values(providers).map((provider: Provider, i) => (

              <Button
                key={i}
                title='Sign In with Google'
                type='button'
                handleClick={()=> signIn(provider?.id)} // { callbackUrl: `/trainer/${trainerId}` }
                bgColor='bg-slate-700'
                textColor='text-slate-200'
                googleIcon={true}
              />
            ))}
          </div>
        )
    }

}

export default AuthProviders