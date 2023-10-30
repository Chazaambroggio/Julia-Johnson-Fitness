import React from 'react'

const loading = () => {
  return (
    <div className='flex flex-col self-center justify-start items-center h-full w-full max-w-[1024px] gap-8'>   
    
      <div className='w-full my-3 p-3 rounded-lg border border-slate-200 bg-slate-400 animate-pulse min-h-[32px]'>

      </div>
      Loading...
    </div>
  )
}

export default loading