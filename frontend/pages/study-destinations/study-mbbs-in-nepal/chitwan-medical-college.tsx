import ListedTable from '@/components/studyDestinationComponents/ListedTable'
import React from 'react'
const academicCalenderData={
    id:"nepal",
    section2:"",
    content:{
        title:"Academic Calender",
        subTitle:"A glimpse of the important dates an aspirant must keep in mind to get on board the best medical colleges in Nepal. The information below is not absolute and may vary university-wise.",
        data:[["Events","Dates"],
        ["Admission process","Starts in the month of May"],
        ["Last date of application","July/August"],
        ["Commencement of MBBS course","From December"]],
    }
}

const eligibilityData={
    id:"nepal",
    section2:"",
    content:{
        title:"Eligibility Criteria",
        subTitle:"Eligibility Criteria for MBBS in Nepal for Indian students",
        data:[["Criteria","Details"],
        ["Academic Qualification",["Class 12 (equivalent) with Phy, Chem, Bio (PCB).","General Category: Min 50% aggregate in PCB.","SC/ST/OBC: Min 40% aggregate in PCB."]],
        ["NEET Qualification",["NEET qualification is mandatory."]],
        ["Age Limit & Other information",["Minimum 17 years as of December 31, 2024.","Only current academic year NEET is accepted.","General category NEET score is considered for Indian student.",
            "Fees to be deposited directly in the account of Medical College after getting admission letter, as mentioned in the admission letter." ,
            "Students will also have to undergo a counselling/interview held by the MEC. "
        ]]],
    }
}

const services = [
    {
      icon: "/assets/Images/Icons/feesIcon.svg",
      text: "Tuition and Hostel Fees",
      label: "57 Lakhs",
    },
    {
      icon: "/assets/Images/Icons/ExperienceIcon.svg",
      text: "",
      label: "Recognition by WHO, NMC",
    },
    {
      icon: "/assets/Images/Icons/TieUpsIcon.svg",
      text: "City & Province",
      label: "Chitwan, Nepal",
    },
    {
      icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
      text: "Year of Establishment",
      label: "2006",
    },
  ];

import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcumbs'
import { TransitionLink } from '@/utils/TransitionLink';

const NewPage = () => {
   const callBtnFnc=()=>{
        window.location.href = "tel:+919873381377"
    }
    const whatsappBtnFnc=()=>{
        window.open('https://wa.me/919873381377?')
    }
  return (
    <div>
         <div className="flex flex-col gap-[2vw] mb-[1vw] py-[4vw] items-center  ">
                <div className="mx-[6vw] flex flex-col items-center gap-[2vw] md:gap-[2vw]">
                    <Breadcrumbs/>
                </div>
                <div className='bg-linenChosen flex flex-col md:flex-row gap-[3vw] items-center w-full'>
                    <Image className='w-full md:w-[40.625vw] h-full' src={"/assets/Images/mbbs-in-nepal/chitwan-medical-college.png"} alt='college Image' width={650} height={550}/>
                    <div className='relative mx-[6vw] md:mx-0 py-[4vw]'>
                      <h2 className='font-bold text-h3TextPhone md:text-h2Text leading-[120%] mb-[2vw] md:mb-[1.5vw]'>Chitwan Medical College</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2.25vw]  md:gap-[.75vw] items-center  justify-center">
                                    {services.map((item, index) => (
                                      <div key={index} className="w-full md:w-[16.5vw] relative mx-auto shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                                                  rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex items-center justify-start py-[3vw] 
                                                  md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
                                        <Image src={item.icon}
                                          alt={item.label} width={64} height={64} className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative  overflow-hidden shrink-0" />
                                        <p className="text-tinyTextPhone md:text-tinyText text-center leading-[150%]"> {item.text} <br /><span className="font-semibold"> {item.label}</span></p>
                                      </div>
                                    ))}
                                  </div>
                      <div className='absolute right-0 bottom-[2vw] flex gap-[8px] text-white text-smallTextPhone md:text-regularText font-semibold'>
                        <button onClick={callBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[10vw] md:rounded-[.675vw] p-[10px]'>+91 98733 81377</button>
                        <button onClick={whatsappBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[12vw] md:rounded-[.675vw] flex items-center justify-center p-[10px] gap-[2vw] md:gap-[.5vw] '><Image src={"/assets/Images/Icons/whatsapp.png"} alt='whatsapp' width={40} height={40} /> +91 98733 81377</button>
                      </div>
                    </div>
                </div>                                 
            </div>

       {/* Medical College */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text md:text-center text-left mb-[4vw] md:mb-[1vw]">Chitwan Medical College</h3>
               <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
                <li>Chitwan Medical College (CMC) was established on 20th June 2006. Chitwan Medical College (CMC), a tertiary care hospital, serves the catchment area of Narayani zone and Central Region of Nepal, an area with a rapidly growing population. Initiated and managed by renowned medical professionals and practitioners of the country, making this Institution one of such kind, CMC is providing a world-class medical education to future academics, medical practitioners, and healthcare professionals.</li>
                <li>It started with an initial intake of 80 students per year in the Bachelor of Medicine and Bachelor of Surgery (MBBS) program. Over the years, CMC has expanded its academic offerings to include nursing, pharmacy, public health, and other allied health sciences programs.</li>
                <li>CMC provides professional qualifications over a range of specializations.</li>
                <li>CMC trains future health professionals to serve selflessly and humbly, while emphasizing strong medical ethics and appreciation of human worth and dignity.</li>
                <li>In pursuit of maintaining excellent standards, CMC is continuously upgrading the clinical expertise, state-of-the-art equipment, and latest diagnostic and imaging services.</li>
                </ul>                        
            </section>

        {/* Mission and Faculty*/}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Chitwan Medical College - objectives</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>To provide quality education for different levels of medical, dental, nursing, and allied health streams through highly qualified professionals.</li>
                <li>To diversify academic programs par to the demand of changing educational preferences of students.</li>
                <li>To deliver patient-oriented services at an affordable cost using cutting-edge technology through highly qualified professionals.</li>
                <li>To support the government for the implementation of national health policies and programs.</li>
                <li>To upgrade diagnostic services with globally recognized technologies.</li>
                <li>To deliver preventive, promotive, curative, and rehabilitative services as per the need of communities.</li>
              </ul> 

              <h3 className="text-h6TextPhone leading-[120%]   md:text-h5Text  text-left">Chitwan Medical College - Mission</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>To demonstrate exemplary leadership in the field of medical education, health care services and research by evolving into a deemed university
                </li>
              </ul>
              <h3 className="text-h6TextPhone leading-[120%]   md:text-54Text  text-left">Chitwan Medical College - Vision</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>CMC aspires to be a center of excellence for medical education, services and research.
                </li>
              </ul>
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Chitwan Medical College - Goals</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Offer world class medical education.</li>
                <li>Offer world class medical education.</li>
                <li>Enhance research culture in par with national and international contemporaries.</li>
                <li>Become Nepal’s leading partnership in medical education.</li>
                <li>Promote self-sustainability of institution.</li>
                </ul> 
                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Chitwan Medical hospital - operations</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
                <li>CMC operates a 750-bed teaching hospital located in Bharatpur.</li>
                <li>The hospital provides a wide range of healthcare services and is equipped with advanced diagnostic and therapeutic facilities.</li>
                <li>The medical college is affiliated with Tribhuvan University and is recognized by the Nepal Medical Council.</li>
              </ul>                 
            </section>

        {/* Mission, Excellence, Engagement and Teaching Hospital */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
             <h3 className="text-h5TextPhone leading-[120%]   md:text-h3Text text-left">Chitwan Medical college offers following programs</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Bachelor of Medicine and Bachelor of Surgery (MBBS)</li>
                <li>Bachelor of Nursing Sciences (BNS)</li>
                <li>Bachelor of Pharmacy (BPharm)</li>
                <li>Bachelor of Public Health (BPH)</li>
                <li>Post Graduate - MD/MS in various specialties</li>
            </ul>     

              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text text-left">Chitwan Medical Hospital services</h3>
               <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">Chitwan Medical College Teaching Hospital provides following services:</p>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Outpatient and Inpatient services</li>
                <li>Emergency and Trauma care</li>
                <li>Intensive Care Units (ICU)</li>
                <li>Neonatal Intensive Care Units (NICU)</li>
                <li>Surgical and Medical services</li>
                <li>Diagnostic services including Laboratory, Radiology (X-rays, CT scans, MRI), and Ultrasonography</li>
                <li>Specialty Clinics and Departments</li>

              </ul>

              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text text-left">Sports Involvement</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
             <li>In addition to its academic and medical operations, Chitwan Medical College is actively involved in promoting sports.</li>
<li>In 2024, CMC became the owner of the Chitwan Rhinos in the Nepal Premier League (NPL), a major cricket tournament in Nepal. This involvement in the NPL highlights the college's commitment to supporting sports and community engagement beyond the medical field.</li>

                </ul>
            </section>

            {/* At a galance  */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Birat Medical College at a glance </h3>
             
                <ul className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] text-left gap-x-[1vw] md:text-regularText md:text-justify grid grid-cols-2 ">
                <li className='font-bold'>o	College name	</li>
                <li>Chitwan Medical College</li>
                <li className='font-bold'>o	University affiliation	</li>
                <li>TU</li>
                <li className='font-bold'>o	Recognition</li>
                <li>WHO, NMC</li>
                <li className='font-bold'>o	Year of Establishment</li>
                <li>2006</li>
                 <li className='font-bold'>o	Hospital bed Number</li>
                <li>750</li>
                <li className='font-bold'>o	Medium of Instruction</li>
                <li>English</li>
                <li className='font-bold'>o	Course Duration</li>
                <li>4.5 years</li>
                <li className='font-bold'>o	Internship Duration</li>
                <li>1 year</li>
                <li className='font-bold'>o	NEET</li>
                <li>Mandatory</li>                
                <li className='font-bold'>o	Intake</li>
                <li>September</li>
                <li className='font-bold'>o	Location</li>
                <li>Chitwan, Nepal</li>
                </ul>  
            </section>

          {/* Why chose section */}
          <div className="p-[8vw] md:p-[4vw] flex flex-col md:flex-row  px-[6vw] md:px-[12.5vw] gap-[5vw] md:gap-[2vw] mb-[10vw] md:mb-[4vw] items-center bg-linenChosen">
                            <div className="flex flex-col gap-[2vw] md:gap-[1vw] ">
                                <div>
                            <h3 className="font-bold text-h5TextPhone md:text-h3Text  leading-[120%]">Chitwan Medical College Hostel</h3>
                            <ul className="list-disc list-outside pl-[2vw] md:pl-[1.5vw]">
                                <li>Provides well-furnished accommodation.</li>
                                <li>4 separate 3-winged four-story hostels, 2 each for boys and girls with a living capacity of 960 students.</li>
                                <li>A single room must be shared by 2 students of the same gender.</li>
                                <li>A separate canteen in each complex with free Wi-Fi is available.</li>
                                <li>Water supply, drinking and sanitary facilities.</li>
                                <li>Well-equipped and highly maintained.</li>
                            </ul>
                            </div>
                            <div>
                             <h3 className="font-bold text-h5TextPhone md:text-h3Text  leading-[120%]">Recreation Facilities</h3>
                            <ul className="list-disc list-outside pl-[2vw] md:pl-[1.5vw]">
                                <li>One central hall with A-V facilities.</li>
                                <li>Sports facilities available.</li>
                                <li>An excellent facility for indoor/outdoor games near the hostel within the college premises, which the students can use for physical and mental fitness.</li>
                                <li>Cricket Field, Soccer Field, Basketball Court, Volleyball Court, Badminton Court, Multiple Table-Tennis Boards, Indoor Game Facilities.</li>
                            </ul>
                            </div>
                           
                            </div>  
                            <Image src={"/assets/Images/mbbs-in-nepal/nepal2.png"} className="ml-auto w-full   md:w-[32.5vw] h-auto" width={690} height={690  } alt="georgia3"/>
                        </div>

            {/* Infrastructure, Benefits and Recognition */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Chitwan Medical College – Recognition</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
                <li>Chitwan Medical College is recognized by international organizations such as WHO, NMC which attracts international students from all around the world to Study MBBS at Birat Medical College.</li>
              </ul>
            </section>


        {/* Eligibility Criteria */}
                <ListedTable id={eligibilityData.id} section2={eligibilityData.section2} content={eligibilityData.content} />
                
            {/* Academic Calander */}
                <ListedTable id={academicCalenderData.id} section2={academicCalenderData.section2} content={academicCalenderData.content} />


        {/* Document and Popular Colleges */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Chitwan Medical College Admission Process</h3>
                <p className='text-smallTextPhone text-left md:text-regularText md:text-justify '> Students who meet the eligibility criteria can follow some easy steps to complete the admission process at B & C Medical College. </p>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify mb-[4vw] md:mb-[1vw]">
                    <li>Submission of all relevant documents</li>
                    <li>Fill out application form.</li>
                    <li>Document verification.</li>
                    <li>Get an Admission Letter from the University.</li>
                    <li>Pay admission fees.</li>
                    <li>Submission of passport and other documents required.</li>

                </ul>
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Required Documents for B & C Medical College</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify mb-[4vw] md:mb-[1vw]">
                    <li>10th & 12th mark sheet</li>
                    <li>Aadhaar card/voter ID</li>
                    <li>Passport (if ready)</li>
                    <li>Birth certificate</li>
                    <li>Passport-sized photographs</li>
                    <li>Documents should be apostilled by the ministry of external affairs</li>
                    <li>All documents need to be legalized by the Nepali embassy</li>
                </ul>
               
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Other popular College of Medical Science for MBBS in Nepal</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify underline">
                    <li> <TransitionLink href='nepal-medical-college'>Nepal Medical College</TransitionLink></li>
                    <li><TransitionLink href='kathmandu-medical-college'>Kathmandu Medical College</TransitionLink></li>
                    <li><TransitionLink href='nobel-medical-college'>Nobel Medical College</TransitionLink></li>
                    <li>KIST Medical College</li>
                    <li><TransitionLink href='birat-medical-college'>Birat Medical College</TransitionLink></li>
                    <li><TransitionLink href='college-of-medical-science'>College of Medical Science</TransitionLink></li>
                    <li><TransitionLink href='lumbini-medical-college'>Lumbini Medical College</TransitionLink></li>
                    <li><TransitionLink href='devdaha-medical-college'>Devdaha Medical College</TransitionLink></li>
                    <li><TransitionLink href='b&C-medical-college'>B&C Medical College</TransitionLink></li>
                </ul>  
            </section>

            

    </div>
  )
}

export default NewPage
