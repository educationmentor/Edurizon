import React from 'react'



export default function EdurizonProcess({country}:{country:string}) {
  const howEdurizonHelps = [
    {
      title: "Personalized Counseling",
      description:
          "Not sure which university or country is right for you? Our experienced counselors take the time to understand your academic background, NEET status, budget, and preferences. We then recommend the best-fit universities in Russia that accept students without NEET and meet your criteria. Whether you prioritize low fees, a particular city, or a university’s ranking, we provide tailored advice so you can make an informed choice.",
    },
    {
    title: "University Applications",
    description:
        "The application process can involve a lot of paperwork and coordination. Edurizon will handle your application to the university of your choice – from filling out forms correctly to communicating with the university’s admissions office on your behalf. We ensure your application is error-free and submitted within deadlines, increasing your chances of quick acceptance.",
    },
    {
      title: "Documentation Support",
      description:
          "Worried about getting all those documents ready? We’ve got you covered. Our team will give you a checklist of all required documents (passport, transcripts, medical tests, etc.) and help you get them in order. We assist in tricky tasks like getting your documents translated and apostilled as needed, arranging your medical fitness certificates, and preparing any affidavits. By double-checking everything, we make sure there are no last-minute hiccups.",
    },
    {
      title: "NEET and Eligibility Guidance",
      description:
          "Since studying without NEET involves understanding certain regulations, Edurizon clarifies the NMC guidelines and eligibility criteria. We will keep you updated on the latest rules (for example, any changes in foreign medical graduate regulations) and advise you accordingly. If you plan to reappear for NEET while in Russia, we can connect you with resources or coaching material to help you prepare alongside your studies. Our goal is to ensure your path to becoming a doctor is secure from day one until you get your license.",
    },
    {
      title: "Securing Admission and Visa",
      description:
          "Once you get your admission letter, the next crucial step is obtaining your visa. Edurizon’s experts will guide you through the visa application – we help you fill out the visa form, gather the right documentation, and even conduct mock interview prep if needed. With our experience, we anticipate what the visa officers expect and ensure you are well-prepared. From getting that invitation letter to stamping the visa, we stay with you at every step.​.",
    },
    {
      title: "Pre-Departure Orientation",
      description:
          "Heading to a new country can be daunting. That’s why we conduct pre-departure sessions for students. We brief you on what to pack, how to handle immigration on arrival, and currency exchange, and we even give you tips about student life in Russia. We often connect students going to the same university so you can travel in groups and feel more comfortable knowing someone even before you land in Russia.",
    },
    {
      title: `Support in ${country}`,
      description:
          "Our assistance doesn’t end once you board the flight. Edurizon has tie-ups and contacts in Russia – local coordinators and senior students – who can help you upon arrival. From picking you up at the airport (if needed) to helping with your university registration and hostel check-in, we ensure you cannot fend for yourself. Throughout your course, if you face any issues or have questions, you can contact us. We remain a bridge between you and the university if communication gaps arise due to language or other reasons.",
    },
    {
      title: "FMGE/NExT Coaching and Career Guidance",
      description:
          "As you near the end of your MBBS, you might want guidance for the next steps. Edurizon can assist with FMGE (Foreign Medical Graduate Exam) preparation resources and update you on the upcoming NExT exam system. We also advise on opportunities after MBBS – returning to India for practice, pursuing post-graduate studies abroad, or anything else. Our relationship with students is long-term – we celebrate your successes and help you overcome any hurdles along the way.",
    },
                              
  ]
  return (
      <section className='px-[6vw] md:px-[12.625vw] text-smallTextPhone md:text-regularText leading-[150%]'>
        <h3 className='pb-[3vw] text-h5TextPhone md:text-h3Text leading-[120%]'>How Can Edurizon Help You Navigate the Process?</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-[4vw] pb-[4vw] md:pb-[2vw]  gap-y-[4vw] md:gap-x-[2vw] md:gap-y-[2vw]'>
            {howEdurizonHelps.map((item,index)=>(
              <div key={index}>
              <h6 className='  md:mb-[.5vw]'>{item.title}</h6>
              <p className=' text-[rgba(0,0,0,.6)] dark:text-white'>{item.description}</p>
              </div>  
            ))}
            
        </div>
        <p className='font-bold pb-[.5vw]'>Why to choose Edurizon</p>
        <p className='pb-[4vw] md:pb-[2vw]'>
          By choosing Edurizon, you gain a mentor and facilitator who will make your dream of studying MBBS in Russia a reality, even if NEET has been a roadblock. We have years of experience sending students to top medical universities abroad so that you can trust our process. You should focus on studying and becoming a great doctor – let us handle the logistics and paperwork! Ready to take the next step toward your medical career? Edurizon is here to turn your aspirations into achievements.
        </p>
        <p className='font-bold text-center'>With comprehensive support across academics, daily life, and long-term planning, Edurizon empowers students to settle in confidently and thrive in their new environment.</p>
      </section>
  )
}
