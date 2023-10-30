'use client';
import React, { Fragment, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { SessionInterface } from '@/common.types'
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ProfileMenu = ({ session} : {session : SessionInterface}) => {

    const [openModal, setOpenModal] = useState(false);

    const stripeCustomerPortalLink = `https://billing.stripe.com/p/login/test_cN25lS76pg8J3Ti5kk?prefilled_email=${session?.user?.email}`

    const handleToggleModal = () => {
        setOpenModal(prev => !prev);
        setRotateMenu((prevState) => !prevState)
      };

    const [rotateMenu, setRotateMenu] = useState(false);   

  return (
    <div className='flex flex-col justify-start z-90 relative '>
        <Menu as='div'>
            <Menu.Button 
                className='flex justify-center items-center'
                onClick={handleToggleModal}
            >
                
            <FontAwesomeIcon  
                icon={faBars}
                className={`text-2xl text-white ease-in duration-300 ${rotateMenu ? 'rotate-90' : null}`}
                
            />
              
            </Menu.Button>

            <Transition
                show={openModal}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    static
                    className='flex items-center justify-start flex-col absolute z-50 right-1 translate-x-1 mt-3 p-7 
                    sm:min-w-[300px] min-w-max rounded-xl bg-white border border-nav-border shadow-menu'
                > 
                    <div className="flex flex-col items-center gap-y-4">
                        {session?.user?.avatarUrl && (
                            <Image
                                src={session?.user?.avatarUrl}
                                className="rounded-full"
                                width={80}
                                height={80}
                                alt="profile Image"
                            />
                        )}
                        <p className="font-semibold">{session?.user?.username}</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-10 items-start w-full">

                            <Menu.Item>
                                <Link 
                                    href= {`/user/${session?.user?.id}`}
                                    onClick={handleToggleModal}>
                                    My Workouts
                                </Link>
                            </Menu.Item>
                            {session?.user?.role === 'client' && (
                            <Menu.Item>
                                    <Link 
                                        href='/subscription/plans'
                                        onClick={handleToggleModal}>
                                        Subscription
                                    </Link>
                                </Menu.Item>
                            )}

                            {session?.user?.subscriptionId && (
                                <Menu.Item>
                                    <Link 
                                        href= {stripeCustomerPortalLink}
                                        onClick={handleToggleModal}>
                                        Manage Subscription
                                    </Link>
                                </Menu.Item>
                            )}
                            
                            {session?.user?.role == 'trainer' && (
                                <>
                                <Menu.Item>
                                    <Link 
                                        href={`/exercises`} 
                                        onClick={handleToggleModal}>
                                        Exercises
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link 
                                        href='/users'
                                        onClick={handleToggleModal}>
                                        Students
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link 
                                        href='/workouts/free'
                                        onClick={handleToggleModal}>
                                        Free Workouts
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link 
                                        href='/subscriptions'
                                        onClick={handleToggleModal}>
                                        Subscriptions
                                    </Link>
                                </Menu.Item>
                                </>
                            )}

                            <Menu.Item>
                                <button type='button' className='text-sm' onClick={() => signOut()}>
                                    Sign Out
                                </button>
                            </Menu.Item>
                    </div>

                </Menu.Items>
            </Transition>
        </Menu>
        
 
    </div>
  )
}

export default ProfileMenu