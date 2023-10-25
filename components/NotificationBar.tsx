import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import AuthProviders from './AuthProviders';
import { getCurrentUser } from '@/lib/session';
import ProfileMenu from './ProfileMenu';


const NotificationBar = async () => {
    const session = await getCurrentUser();
  return (
    <nav className='flex justify-between items-center px-8 py-1 border-b border-nav-border gap-4 bg-blue-500'>
        <div className='flex justify-start items-center'>
            <Link href='/'>
                <Image
                    src={"/assets/logo/logo-bg-transperent.png"}
                    width={50}
                    height={50}
                    alt='Fitness logo'
                
                />
            </Link>
            
        </div>
        <div className='flex justify-center items-center gap-4'>
            {session?.user 
                ? ( <ProfileMenu session={session} /> ) 
                : ( <AuthProviders /> )    
            }
        </div>
       

    </nav>
  )
}

export default NotificationBar