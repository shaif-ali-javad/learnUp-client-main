import React from 'react'

const LanguageCard = () => {
  return (

    <div className='w-full h-full bg-white shadow-lg'>
      <div className='flex flex-col items-center justify-center gap-4 p-6'>
        <img src="https://i.ibb.co/3y0x1fH/learnup.png" alt="Language Logo" className='w-16 h-16' />
        <h2 className='text-xl font-semibold text-primary'>Learn Up</h2>
        <p className='text-gray-600'>Your gateway to mastering new languages.</p>
      </div>
    </div>

  )
}

export default LanguageCard
