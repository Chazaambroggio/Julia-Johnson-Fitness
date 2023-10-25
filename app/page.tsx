import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import AuthProviders from '@/components/AuthProviders';


export default async function Home () {
  const session = await  getCurrentUser();

  if (session?.user.role == 'client'){
    redirect(`/dashboard/client/${session?.user?.id}`)
  } else if (session?.user.role == 'trainer'){
    // redirect(`/dashboard/trainer/${session?.user?.id}`)
    redirect(`/users`)

  } else {
    return (
      <main 
        className="flex flex-col h-full justify-center items-center p-4">
          <div className='flex flex-col w-full justify-center items-center'>
            <Image
              src="/assets/logo/logo-bg-transperent.png"
              width={128}
              height={128}
              alt='Fitness logo'
            />
            <h1 
              className='text-xl font-bold text-center md:text-5xl'
              > 
              Julia Johnson Fitness
            </h1>
          </div>
          <div className='flex w-full justify-center items-center'>
            <AuthProviders />
          </div>
      </main>
    )
  }
}
