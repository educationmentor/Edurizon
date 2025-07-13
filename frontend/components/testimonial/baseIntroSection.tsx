import Image from 'next/image'
import React from 'react'
const services = [
    {
      icon: "/assets/Images/Icons/onboardedIcon.svg",
      text: "5000+",
      label: "Students onboarded",
    },
    {
      icon: "/assets/Images/Icons/TieUpsIcon.svg",
      text: "150+",
      label: "University Tie Ups",
    },
    {
      icon: "/assets/Images/Icons/ExperienceIcon.svg",
      text: "15+",
      label: "Years of Experience",
    },
    {
      icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
      text: "150+",
      label: "Academic Courses",
    },
  ];

const BaseIntroSection = () => {
  return (
    <div className='flex flex-col  items-center bg-white dark:bg-transparent dark:text-white'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.25vw]  md:gap-[1.125vw] items-center px-[5vw] md:p-[.5vw] my-[10vw] md:my-[4.75vw] justify-center">
      {services.map((item, index) => (
        <div
          key={index}
          className="w-[37.5vw] md:w-[16.5vw] h-[29.25vw] md:h-[12.875vw] relative shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                    rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex flex-col items-center justify-start py-[3vw] 
                    md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
          <Image
            src={item.icon}
            alt={item.label}
            width={64}
            height={64}
            className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative  overflow-hidden shrink-0"
          />
          <p className="text-center">
            {item.text}
            <br />
            {item.label}
          </p>
        </div>
      ))}
                </div>
    </div>
  )
}

export default BaseIntroSection
