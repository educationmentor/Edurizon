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
      text: "Tuition Fees",
      label: "52Lakh",
    },
    {
      icon: "/assets/Images/Icons/ExperienceIcon.svg",
      text: "",
      label: "Recognition by WHO, NMC",
    },
    {
      icon: "/assets/Images/Icons/TieUpsIcon.svg",
      text: "City & Province",
      label: "Biratnagar, Nepal",
    },
    {
      icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
      text: "Year of establishment",
      label: "2004",
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
                    <Image className='w-full md:w-[40.625vw] h-full' src={"/assets/Images/mbbs-in-nepal/nobel-medical-college.png"} alt='college Image' width={650} height={550}/>
                    <div className='relative mx-[6vw] md:mx-0 py-[4vw]'>
                      <h2 className='font-bold text-h3TextPhone md:text-h2Text leading-[120%] mb-[2vw] md:mb-[1.5vw]'>Nobel Medical College</h2>
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
              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text md:text-center text-left mb-[4vw] md:mb-[1vw]">Nobel Medical College</h3>
       
            
                <ul className=" list-disc ml-[3vw] md:ml-[1.5vw] text-smallTextPhone  text-left md:text-regularText md:text-justify">
                <li>Nobel Medical College Teaching Hospital (P) Ltd., MBBS in Nepal, affiliated to Kathmandu University, was established in the year 2004. Nobel Medical College is situated in Biratnagar, Nepal, which is one of the major academic hubs in the eastern part of Nepal.</li>
                <li>The key objective of Nobel Medical College is to impart international standard medical education to meritorious students, both from Nepal as well as abroad.</li>
                <li>Nobel Medical College has been recognized by the Nepal Medical Council (NMC), Ministry of Education, Nepal and Ministry of Health, Nepal.</li>
                <li>The Medical Education Commission, Nepal has constantly maintained its academic standards as per the requirements of other medical councils and universities across the globe.</li>
                <li>Nobel Medical College is equipped with internationally renowned faculties who are professionally committed in the medical field. The selfless devotion and genuine contribution of Nobel Medical College have always supported recognition by Medical Councils worldwide.</li>
                <li>Nobel Medical College is dedicated to enhancing the quality of medical education through innovative teaching methodologies, faculty development, and research in medical education. The goal of Nobel Medical College is to equip healthcare professionals with the knowledge, skills, and ethical values necessary for excellence in patient care and medical research.</li>
                </ul>
            </section>

         <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Nobel Medical College – Vision </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>The vision of Nobel Medical College is to impart quality medical education in a holistic way and serve the various communities of Eastern Nepal as well as the adjoining areas of India like North East, West Bengal, UP, and Bihar.</li>
                <li>The goals of Nobel Medical College are to produce compassionate, community-oriented doctors as professionals with sound cognitive domain, efficient psychomotor skills, effective towards serving the society, competent in application of good communication skills, medical ethics, and professionalism.</li>
              </ul> 

              <h3 className="text-h6TextPhone leading-[120%]   md:text-h5Text  text-left">Nobel Medical College - mission</h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>To enhance teaching and learning methodologies in medical education.</li>
                <li>To develop and implement evidence-based educational strategies.</li>
                <li>To support faculty members in curriculum design and professional development.</li>
                <li>To foster research in health professions education for continuous improvement.</li>
              </ul>            
            </section>

        {/* Mission, Excellence, Engagement and Teaching Hospital */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h5TextPhone leading-[120%]   md:text-h3Text text-left">Nobel Medical College – Teaching Hospital</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                  <li>The hospital currently has 1050 beds of its own at full function.</li>
                    <li>It serves the patients from various communities of Nepal and adjoining Bihar state of India. It has several super Specialty Services with eminent Super Specialized Doctors.</li>
                    <li>The hospital of Nobel Medical College is a tertiary medical service Centre. It offers specialty and super specialty services, including state-of-the art diagnostic facilities to ensure the delivery of holistic patient care.</li>
                    <li>The hospital is staffed with dedicated and highly competent members of the medical fraternity along with trained personnel who work with sophisticated equipment.</li>
                    <li>Nobel Medical College offers graduate and diploma courses recognized by the Kathmandu University.</li>
                    <li>At present, a total of 1151 students are undertaking Medical and Paramedical courses.</li>
                    <li>More than 1300 staff, including both teaching and non-teaching, are on the payroll of the college and render their services with sincerity and competency.</li>
                    <li>Faculties of the institution hold eminent positions in various fields associated with medicine and health care, nationally and internationally.</li>
              </ul>     
            </section>

            {/* At a galance  */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Nobel Medical College at a glance </h3>
             
                <ul className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] text-left gap-x-[1vw] md:text-regularText md:text-justify grid grid-cols-2 ">
                <li className='font-bold'>o	College name	</li>
                <li>Nobel Medical College</li>
                <li className='font-bold'>o	University affiliation	</li>
                <li>KU</li>
                <li className='font-bold'>o	Recognition</li>
                <li>WHO, NMC</li>
                <li className='font-bold'>o	Year of Establishment</li>
                <li>2004</li>
                <li className='font-bold'>o	Medium of Instruction</li>
                <li>English</li>
                <li className='font-bold'>o	Course Duration</li>
                <li>4.5 years</li>
                <li className='font-bold'>o	Internship Duration</li>
                <li>1 year</li>
                <li className='font-bold'>o	Country Rank</li>
                <li>6th</li>
                <li className='font-bold'>o	NEET</li>
                <li>Mandatory</li>                
                <li className='font-bold'>o	Intake</li>
                <li>September</li>
                <li className='font-bold'>o	Location</li>
                <li>Biratnagar, Nepal</li>
                <li className='font-bold'>o	Number of beds</li>
                <li>1050</li>
                <li className='font-bold'>o	Number of specialty services	</li>
                <li>22</li>
                <li className='font-bold'>o	Number of super specialty services	</li>
                <li>14</li>

                <li className='font-bold'>o	Number of diagnostic service departments</li>
                <li>04</li>
                <li className='font-bold'>o	Number of teaching staff	</li>
                <li>300</li>
                <li className='font-bold'>o	Number of medical/technical staff	</li>
                <li>268</li>

                <li className='font-bold'>o	Number of nursing personnel		</li>
                <li>583</li>
                <li className='font-bold'>o	Number of support staff	</li>
                <li>210</li>
                <li className='font-bold'>o	Number of outsource personnel	</li>
                <li>516</li>
                <li className='font-bold'>o	Daily average out patients		</li>
                <li>1500</li>

                
                
                </ul>  
            </section>


         <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Department & Services </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>The high quality of academic research work undertaken by the qualified and dedicated teaching staff of the college has attracted wide attention from scholars of the concerned field. </li>
                <li>Currently more than 300 teaching staff work in Preclinical, Para clinical, Clinical and Super-specialty departments and other services of the college and its hospital.</li>
              </ul> 
            
                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Pre-clinical departments </h3>
              <ul className="text-smallTextPhone mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Anatomy, Physiology, Pathology, Biochemistry, Microbiology, Pharmacology, Community Medicine & Forensic Medicine.</li>
              </ul> 

                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Diagnostic facilities</h3>
              <ul className="text-smallTextPhone mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Diagnostic facilities like Radiology services including 3T Intra-operative functional MRI, 128 slice C.T. Scan and fully-equipped laboratory facilities with Pathology, Biochemistry, Microbiology, Histopathology labs and Blood Bank are available in the institution.</li>
              </ul> 

                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Clinical departments </h3>
              <ul className="text-smallTextPhone  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>General Medicine, General Surgery, Obstetrics & Gynecology, Pediatrics, Orthopedics, Emergency Medicine, Ophthalmology, Otorhinolaryngology – Head and Neck Surgery, Psychiatry, Dermatology, Dentistry, Radiology and Anesthesiology.</li>
              </ul> 

              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Specialized services </h3>
              <ul className="text-smallTextPhone mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Specialized services like Outpatient Services, Day Care. Operating department, Medical Records and Pharmacy efficiently provide their services to the public and the local community. The needs of the underprivileged, the poor and the needy are catered to by the dedicated team of social workers in the Medico-Social Work (MSW) department of the hospital.</li>
              </ul> 

                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Super-specialty departments </h3>
              <ul className="text-smallTextPhone  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>Cardiology including Cath Lab, Neurosurgery, Nephrology, Neurology, Pain and Palliative Care Unit, Pulmonary, Sleep Medicine & Critical Care, Endocrinology, Gastroenterology, Plastic Re-constructive Surgery & Burns, Urology, Laparoscopy Surgery, Developmental and Behavioral pediatrics.</li>
              </ul> 
                
                <h3 className="text-h6TextPhone leading-[120%]   md:text-h5Text  text-left">Neonatal intensive care unit</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Nobel Medical College is the first institution to have a neonatal intensive care unit with the latest modern equipment.</li>
                    <li>It is recognized as a tertiary care referral Centre for high-risk pregnancy and care for preterm babies.</li>
                    <li>It has a 20 bedded PICU providing services to both in-born and out-born babies.</li>
                    <li>This unit has newer modes of ventilation with provision of TPN and developmental care plan on board for appropriate growth and development of babies.</li>
                    <li>The unit is well equipped with 7 ventilators, bubble CPAP machines, multi-parameter monitors, pulse oximeters, infusion pumps, T piece resuscitators, ABG machine, transport incubators, USG machine and portable X-ray machine amongst other equipment.</li>
                </ul> 

              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Dialysis Unit </h3>
              <ul className="text-smallTextPhone  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>The hospital is equipped with 10 bedded dialysis (kidney treatment) unit which is largest unit in the eastern part of Nepal.</li>
              </ul> 

              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Skill lab </h3>
              <ul className="text-smallTextPhone  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                <li>There is a clinical skill laboratory at the hospital building. It has all basic facilities including manikins, simulator units in the laboratory where students, junior doctors and other staff members are trained in first aid, trauma, Basic Life Savers care, Advanced Cardiac Life Support, Advanced Pediatric Life Support, resuscitation, airway management, patient care, etc.</li>
              </ul> 

              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Super Specialty Services </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] grid grid-cols-2 mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Cardiology</li>
                    <li>Cardiothoracic & Vascular Surgery</li>
                    <li>Neurosurgery</li>
                    <li>Neurology</li>
                    <li>Neonatology</li>
                    <li>Gastroenterology</li>
                    <li>Nephrology</li>
                    <li>Pulmonology/Critical Care/Sleep Management</li>
                    <li>Laparoscopic Surgery</li>
                    <li>Endourology surgery</li>
                    <li>Hepatology</li>
                    <li>Gastro-Surgery</li>
                    <li>Endocrinology</li>
                    <li>IVF</li>
                    <li>Kidney Transplant</li>
                    <li>Free service/subsidized service provided by the hospital in last one year</li>
                    <li>Services provided with the coordination of other institutions</li>
                    <li>Laboratory services</li>
                    <li>Radiology services</li>
                    <li>Outpatient Services</li>

                </ul>  
           
                <h3 className="text-h6TextPhone leading-[120%]   md:text-h5Text  text-left">Inpatient Services</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Separate nursing station in each ward with easy access to every corner of the ward.</li>
                    <li>Ramp is constructed from ground floor to 5th floor for patients.</li>
                    <li>Lift system is available.</li>
                    <li>Post OP is equipped with all necessary equipment and instruments.</li>
                    <li>Treatment room, isolation room are available in each ward.</li>
                    <li>Adequate number of separate toilets/bathrooms for male and female patients.</li>
                    <li>Doctor’s room, nursing changing room, store are available in each ward.</li>
                    <li>Security guard for the safety of patient and crowd control in the wards as per need.</li>
                    <li>Well-equipped labour/delivery room as per the requirement.</li>
                    <li>Air conditioner, fan, electricity, water supply in each ward.</li>
                    <li>Enough waiting area.</li>
                </ul> 

                <h3 className="text-h6TextPhone leading-[120%]   md:text-h5Text  text-left">24 hours Emergency services</h3>
                <ul className="text-smallTextPhone list-decimal ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Emergency</li>
                    <li>Laboratory</li>
                    <li>Radiology</li>
                    <li>Emergency Operation</li>
                    <li>Emergency Services are available for 24 hours in the hospital. The Emergency ward has the following facilities:
                    <ul className='text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw]  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify'>
                        <li>Emergency ward is organized separately in the northeast part of the hospital main building with easy access for ambulance and other vehicles. Ramp as well as staircase is built in the main entrance of emergency.</li>
                        <li>A separate billing counter is available for emergency.</li>
                        <li>Triage section, treatment room, resuscitation, observation section are allocated in the emergency.</li>
                        <li>There is a separate radiology service for emergency cases. Fast and direct services for laboratory tests. Blood Bank is available.</li>
                        <li>There is easy access to central laboratory, radiology, emergency Operation Theater and pharmacy from emergency. Patients can be transferred by trolley, wheelchairs.</li>
                        <li>Central laboratory, blood bank, radiodiagnosis, emergency operation, pharmacy, etc. are open for 24 hours with adequate staffing.</li>
                        <li>24 hours medical officers and consultants are available.</li>
                        <li>Round the clock arrangement of security guards.</li>
                        <li>Nepal Police Bit is nearby emergency and they provide service round the clock.</li>
                        <li>Hospital has adequate space for treating patients during disaster.</li>
                        <li>Separate toilet bathroom is available for male and female near emergency ward.</li>
                    </ul>
                    </li>

                </ul> 

                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text  text-left">Out-patient </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] grid grid-cols-2 md:grid-cols-4 mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Medicine</li>
                    <li>Surgery</li>
                    <li>Obs/Gyne</li>
                    <li>Orthopedics</li>
                    <li>Ophthalmology</li>
                    <li>Psychiatry</li>
                    <li>ENT</li>
                    <li>Dermatology</li>
                    <li>Radiodiagnosis</li>
                    <li>Physiotherapy</li>
                    <li>Dental</li>
                </ul>  
            </section>

          {/* Why chose section */}
          <div className="p-[8vw] md:p-[4vw] flex flex-col md:flex-row  px-[6vw] md:px-[12.5vw] gap-[5vw] md:gap-[2vw] mb-[10vw] md:mb-[4vw] items-center bg-linenChosen">
                            <div className="flex flex-col gap-[2vw] md:gap-[1vw] ">
                            <h3 className="font-bold text-h5TextPhone md:text-h3Text  leading-[120%]">Why Choose Nobel Medial College?</h3>
                            <ul className="text-smallTextPhone md:text-regularText list-disc list-outside pl-[2vw] md:pl-[1.5vw]">
                               <li>Nobel Medical College (NMC), Kathmandu University holds a premier position within Nepal’s Medical Environment.</li>
                                <li>Students become part of an extensive community of scholars, clinicians, and stakeholders, who provide a world-class medical education.</li>
                                <li>Expert faculty with years of experience in medical education.</li>
                                <li>Commitment to evidence-based teaching methodologies.</li>
                                <li>State-of-the-art resources and technology for medical training.</li>
                                <li>A focus on continuous professional development for educators and students alike.</li>
                                <li>Nobel Medical College is one of the best colleges for students who wish to study MBBS Abroad.</li>
                                <li><strong>Faculty and staff:</strong> The University has highly qualified professors and faculty who guide students so that in the future students reach their career goals set in the doctorate field.</li>
                                <li><strong>Research and technology:</strong> Faculty provide research classes with advanced technological equipment in laboratories.</li>
                                <li><strong>Accommodation and food:</strong> On-campus facility. Separate boys & girls’ hostel with appropriate security.</li>
                            </ul>
                           
                            </div>  
                            <Image src={"/assets/Images/mbbs-in-nepal/nepal2.png"} className="ml-auto w-full   md:w-[32.5vw] h-auto" width={690} height={690  } alt="georgia3"/>
                        </div>

              <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
              <h3 className="text-h5TextPhone leading-[120%]   md:text-h3Text text-left">Nobel Medical College - Physical infrastructure & facilities</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                  <li>Well-equipped lecture theaters/halls, adequate number of modern teaching learning equipment, tutorial halls, demo rooms, laboratories, seminar halls, etc.</li>
<li>Modern library with adequate number of books, internet facility.</li>
<li>Fully functional modern skill lab.</li>
<li>Functional Medical Education Department, Institutional Review Committee.</li>
<li>Hostel facilities for students, mess/canteen facilities.</li>

              </ul>

              <h3 className="text-h5TextPhone leading-[120%]   md:text-h3Text text-left">Benefits of studying MBBS in Nepal</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                  <li>Well-equipped lecture theaters/halls, adequate number of modern teaching learning equipment, tutorial halls, demo rooms, laboratories, seminar halls, etc.</li>
<li>Modern library with adequate number of books, internet facility.</li>
<li>Fully functional modern skill lab.</li>
<li>Functional Medical Education Department, Institutional Review Committee.</li>
<li>Hostel facilities for students, mess/canteen facilities.</li>


              </ul>

              <h3 className="text-h5TextPhone leading-[120%]   md:text-h3Text text-left">MBBS in Nepal at Nobel Medical College</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                  <li>Nobel Medical College is recognized by the NMC and World Health Organization.</li>
                    <li>The MBBS course at Nobel Medical College is of 5.5 years.</li>
                    <li>1 year internship is compulsory.</li>
                    <li>The medium of instruction for all foreign students at Nobel Medical College is English.</li>
                    <li>The duration of an internship at Nobel Medical College is one year.</li>
                    <li>Nobel Medical College is located in Biratnagar city.</li>
              </ul>         

              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text text-left"> Nobel Medical College – Recognition </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
               <li>Nobel Medical College is listed in the International Medical Education Directory (IMED) and World Directory of Medical Schools (WDOMS).</li>
                <li>Nobel Medical College is recognized by international organizations such as WHO and NMC, which attracts international students from all around the world to study MBBS in Nepal at Nobel Medical College.</li>
              </ul>

              <h3 className="text-h5TextPhone leading-[120%]  md:text-h3Text text-left">Nobel Medical College location </h3>
              <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                  <li>Biratnagar has been established into a Metropolitan City and developed as a regional hub for medical tourism, with a focus on providing world-class facilities and highly trained healthcare workers.</li>
                    <li>Strong links with industry and excellent research capacity have also helped turn Biratnagar into a leading Centre for referrals from different sections of Nepal.</li>
                    <li>Nobel Medical College serves a diverse local community where students will develop clinical skills and knowledge.</li>
                    <li>Many curricular and extra-curricular developments are underway to support learning in this area.</li>
                    <li>Nobel Medical College is located just 5 to 10 minutes away from the Biratnagar Airport.</li>
                    <li>Indian students can also go by their own vehicle via Jogbani border. This border is just 7-8 km away from Nobel Medical College. There are multiple other options for Indian students to reach Biratnagar.</li>
              </ul>



            </section>

        {/* Eligibility Criteria */}
                <ListedTable id={eligibilityData.id} section2={eligibilityData.section2} content={eligibilityData.content} />
                
            {/* Academic Calander */}
                <ListedTable id={academicCalenderData.id} section2={academicCalenderData.section2} content={academicCalenderData.content} />





        {/* Document and Popular Colleges */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Nobel Medical College Admission Process</h3>
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
               
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Other popular College t Medical Science for MBBS in Nepal</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify underline">
                    <li> <TransitionLink href='nepal-medical-college'>Nepal Medical College</TransitionLink></li>
                                       <li><TransitionLink href='kathmandu-medical-college'>Kathmandu Medical College</TransitionLink></li>
                                        <li><TransitionLink href='b&c-medical-college'>B&C Medical College</TransitionLink></li>
                                        <li>KIST Medical College</li>
                                        <li><TransitionLink href='birat-medical-college'>Birat Medical College</TransitionLink></li>
                                        <li><TransitionLink href='college-of-medical-science'>College of Medical Science</TransitionLink></li>
                                        <li><TransitionLink href='lumbini-medical-college'>Lumbini Medical College</TransitionLink></li>
                                        <li><TransitionLink href='devdaha-medical-college'>Devdaha Medical College</TransitionLink></li>
                                        <li><TransitionLink href='chitwan-medical-college'>Chitwan Medical College</TransitionLink></li>
                </ul>  
            </section>

            

    </div>
  )
}

export default NewPage
