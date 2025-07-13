import React from 'react'
import Image from 'next/image'

const StudentGallerySection = () => {
  return (
    <div className='p-[6vw] mx-[5vw] md:p-[4vw] md:mx-[5vw]'>
        <h2 className='text-h3TextPhone md:text-h2Text font-bold text-center pb-[2vw] md:pb-[1.5vw]'>
        Student Gallery
        </h2>
        <p className='text-mediumTextPhone md:text-mediumText text-center pb-[2vw] md:pb-[1.5vw]'>
        A glimpse into the journeys, memories, and milestones of our students across the globe.
        </p>
        <div className='grid mx-[-6vw] md:mx-0  grid-cols-1 md:grid-cols-3 md:gap-x-[2vw] justify-center'>
            <div className='md:col-span-1 flex flex-col gap-y-[2vw] pb-[2vw] md:pb-0'>
                <Image src="/assets/Images/studentGallery/col11.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
                <Image src="/assets/Images/studentGallery/col12.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
            </div>
            <div className='md:col-span-1 flex flex-col gap-y-[2vw] justify-center pb-[2vw] md:pb-0'>
                <Image src="/assets/Images/studentGallery/col21.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
                <Image src="/assets/Images/studentGallery/col22.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
                <Image src="/assets/Images/studentGallery/col23.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
            </div>
            <div className='md:col-span-1 flex flex-col gap-y-[2vw]'>
                <Image src="/assets/Images/studentGallery/col31.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
                <Image src="/assets/Images/studentGallery/col32.png" alt="onboardedIcon" className='w-full md:w-[25.3125vw] h-auto' width={1920} height={1920} />
            </div>
            <div className='md:col-span-1'>
            </div>

        </div> 
    </div>
  )
}

export default StudentGallerySection 
