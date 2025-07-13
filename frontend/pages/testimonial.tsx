import BaseIntroSection from '@/components/testimonial/baseIntroSection'
import StudentGallerySection from '@/components/testimonial/studentGallerySection'
import React from 'react'
import { IconButton } from '@/components/Buttons'
import VideoSection from '@/components/testimonial/videoSection'

const Testimonial = () => {
  return (
    <div >
      <div className='bg-linenChosen md:h-screen '>
        <div className='pt-[40vw] px-[5vw] md:px-0 md:pt-[15.375vw] md:pl-[7.5vw] pb-[6vw] md:pb-[1.5vw] md:w-[47vw]'>
        <h2 className='text-h3TextPhone  md:text-h1Text font-bold  leading-[120%]  w-full mb-[6vw] md:mb-[1.5vw] '>Trusted By Thousand Of Students For Their Study Abroad Journey</h2>
        <p className='text-mediumTextPhone md:text-mediumText pb-[6vw] md:pb-[1.5vw]'>Hear from students who turned their global dreams into reality with Edurizon’s expert guidance.</p>
        <IconButton btnWidth={13}   className=" pointer-events-auto ml-[-0.5vw]  md:flex leading-[110%] text-regularTextPhone md:text-regularText bg-orangeChosen text-white" btnTitle="Free Consultation" btnHeight={2.75} btnHeightPhone={11}
         btnRadius={6.25} btnRadiusPhone={25} btnWidthPhone={52} iconWidth={1.875} padding={.625} paddingPhone={6}  image="/assets/Images/Icons/NorthEastIconOrange.svg" iconWidthPhone={9} />
        </div>
      </div>
      <BaseIntroSection/>
      <VideoSection/>
      <StudentGallerySection/>
    </div>
  )
}

export default Testimonial
