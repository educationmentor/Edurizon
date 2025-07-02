import React from 'react'
import ListedTable from '@/components/studyDestinationComponents/ListedTable'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcumbs'

const academicCalenderData = {
    id: "tajikistan",
    section2: "",
    content: {
        title: "Academic Calendar",
        subTitle: "Important dates for MBBS admission at MSIT, Tajikistan",
        data: [["Events", "Dates"],
        ["Admission process", "Starts in May"],
        ["Last date of application", "July/August"],
        ["Commencement of MBBS course", "September/October"]],
    }
}

const eligibilityData = {
    id: "tajikistan",
    section2: "",
    content: {
        title: "Eligibility Criteria",
        subTitle: "Eligibility Criteria for MBBS in MSIT, Tajikistan for Indian students",
        data: [["Criteria", "Details"],
        ["Age", "Must be 17 years of age as on December 31st of the admission year"],
        ["Academic Qualification", ["Class 12 with PCB", "Minimum 50% in PCB"]],
        ["NEET Qualification", ["NEET qualification is mandatory"]],
        ["Language", "No specific language requirements as medium of instruction is English"]],
    }
}

const services = [
    {
        icon: "/assets/Images/Icons/feesIcon.svg",
        text: "Tuition Fees/ Hostel Fees",
        label: "4000$/500$ per year",
    },
    {
        icon: "/assets/Images/Icons/ExperienceIcon.svg",
        text: "Recognition",
        label: "WHO, FAIMER, WDOMS",
    },
    {
        icon: "/assets/Images/Icons/TieUpsIcon.svg",
        text: "City & Country",
        label: "Dushanbe, Tajikistan",
    },
    {
        icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
        text: "Course Duration",
        label: "5+1 Years",
    },
];

const MedicalSocialInstituteOfTajikistan = () => {
    const callBtnFnc=()=>{
        window.location.href = "tel:+919540994829"
    }
    const whatsappBtnFnc=()=>{
        window.open('https://wa.me/919540994829?')
    }
    
    return (
        <div>
            <div className="flex flex-col gap-[2vw] mb-[1vw] py-[4vw] items-center">
                <div className="mx-[6vw] flex flex-col items-center gap-[2vw] md:gap-[2vw]">
                    <Breadcrumbs/>
                </div>
                <div className='bg-linenChosen flex flex-col md:flex-row gap-[3vw] items-center w-full'>
                    <Image className='w-full md:w-[40.625vw] h-full' src={"/assets/Images/mbbs-in-tajikistan/MSIT.png"} alt='MSIT Image' width={650} height={550}/>
                    <div className='relative mx-[6vw] md:mx-0 py-[4vw]'>
                        <h2 className='font-bold text-h3TextPhone md:text-h2Text leading-[120%] mb-[2vw] md:mb-[1.5vw]'>Medical Social Institute of Tajikistan</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2.25vw] md:gap-[.75vw] items-center justify-center">
                            {services.map((item, index) => (
                                <div key={index} className="w-full md:w-[16.5vw] relative mx-auto shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                                    rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex items-center justify-start py-[3vw] 
                                    md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
                                    <Image src={item.icon}
                                        alt={item.label} width={64} height={64} className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative overflow-hidden shrink-0" />
                                    <p className="text-tinyTextPhone md:text-tinyText text-center leading-[150%]"> {item.text} <br /><span className="font-semibold"> {item.label}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className='absolute right-0 bottom-[2vw] flex gap-[8px] text-white text-smallTextPhone md:text-regularText font-semibold'>
                            <button onClick={callBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[10vw] md:rounded-[.675vw] p-[10px]'>+91-9540994829</button>
                            <button onClick={whatsappBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[12vw] md:rounded-[.675vw] flex items-center justify-center p-[10px] gap-[2vw] md:gap-[.5vw] '><Image src={"/assets/Images/Icons/whatsapp.png"} alt='whatsapp' width={40} height={40} /> +91-9540994829</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Tajikistan */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
            <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">About MSIT, Tajikistan</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>The Medical Social Institute of Tajikistan (MSIT) is a premier medical education institution located in the heart of Dushanbe, the capital of Tajikistan.</li>
                    <li>Established with a vision to offer high-quality and globally recognized medical education, MSIT has quickly emerged as a preferred destination for international medical aspirants, especially from India and South Asia.</li>
                    <li>MSIT is committed to academic excellence, student-centered learning, and producing competent, ethical, and skilled medical professionals. The university follows the international standards of medical education and is fully equipped with modern teaching tools, digital classrooms, laboratories, simulation centers, and a strong practical training system.</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">About Tajikistan: A Safe and Friendly Study Destination</h3>
                <p className="text-smallTextPhone text-left md:text-regularText">Tajikistan is a Central Asian country known for its stunning mountainous landscapes, cultural richness, and peaceful society. It shares friendly relations with India and offers a welcoming atmosphere for international students.</p>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Capital: Dushanbe</li>
                    <li>Language: Tajik (English widely spoken in universities)</li>
                    <li>Currency: Somoni (TJS)</li>
                    <li>Climate: Continental (pleasant weather, especially suitable for Indian students)</li>
                    <li>Religion: Majority Muslim (harmonious and tolerant society)</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Life in Dushanbe</h3>
                <p className="text-smallTextPhone text-left md:text-regularText">Dushanbe is the capital of Tajikistan which is situated on the Varzob River. Rudaki Park which is named after a classical poet is situated on the east bank of the river.<br/> It offers:</p>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Safe and affordable accommodation options</li>
                    <li>Indian food availability (Indian mess in university hostel)</li>
                    <li>Well-developed transportation and healthcare</li>
                    <li>Vibrant multicultural environment</li>
                </ul>
               
            </section>

            {/* Why Choose Section */}
            <div className="p-[8vw] md:p-[4vw] flex flex-col md:flex-row px-[6vw] md:px-[12.5vw] gap-[5vw] md:gap-[2vw] mb-[10vw] md:mb-[4vw] items-center bg-linenChosen">
                <div className="flex flex-col gap-[2vw] md:gap-[1vw]">
                    <div>
                        <h3 className="font-bold text-h5TextPhone md:text-h3Text leading-[120%] mb-[4vw] md:mb-[1vw]">Why Choose MSIT for MBBS Abroad?</h3>
                        <ul className="list-disc list-outside pl-[2vw] md:pl-[1.5vw] text-smallTextPhone md:text-regularText">
                            <li>Globally Recognized Degree: MSIT's MBBS degree is recognized by global bodies such as WHO, FAIMER, and it is listed in the World Directory of Medical Schools (WDOMS). Graduates are eligible to sit for international licensing exams like FMGE (India), USMLE (USA), PLAB (UK), etc.</li>
                            <li>Affordable Education: Pursuing MBBS at MSIT is highly cost-effective. The tuition fees and living expenses in Tajikistan are much lower compared to private medical colleges in India or universities in countries like the USA, UK, or Australia.</li>
                            <li>English-Medium MBBS Program: MBBS program is fully taught in English, making it easier for Indian and international students to follow the curriculum without any language barrier.</li>
                            <li>Experienced Faculty & Clinical Exposure: MSIT boasts a team of highly qualified professors, doctors, and researchers. The university has collaborations with leading hospitals in Dushanbe where students undergo practical training and clinical rotations.</li>
                            <li>FMGE/NExT Coaching Support: Indian students receive structured support and guidance for FMGE/NExT preparation to ensure high passing percentages after graduation.</li>
                        </ul>
                    </div>
                </div>
                <Image src={"/assets/Images/mbbs-in-nepal/nepal2.png"} className="ml-auto w-full md:w-[32.5vw] h-auto" width={690} height={690} alt="tajikistan"/>
            </div>

            {/* At a glance Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MSIT at a glance</h3>
                <ul className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] text-left gap-x-[1vw] md:text-regularText md:text-justify grid grid-cols-2">
                    <li className='font-bold'>o College name</li>
                    <li>Medical Social Institute of Tajikistan (MSIT)</li>
                    <li className='font-bold'>o Recognition</li>
                    <li>WHO, FAIMER, WDOMS</li>
                    <li className='font-bold'>o Medium of instruction</li>
                    <li>English</li>
                    <li className='font-bold'>o Course duration</li>
                    <li>5 years + 1 year internship</li>
                    <li className='font-bold'>o Internship duration</li>
                    <li>1 year (can be done in India)</li>
                    <li className='font-bold'>o NEET</li>
                    <li>Mandatory</li>
                    <li className='font-bold'>o Tuition Fees</li>
                    <li>$4000/year</li>
                    <li className='font-bold'>o Hostel Fees</li>
                    <li>$500/year</li>
                    <li className='font-bold'>o Intake</li>
                    <li>September/October</li>
                    <li className='font-bold'>o Location</li>
                    <li>Dushanbe, Tajikistan</li>
                </ul>
            </section>

            {/* MBBS Program Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MSIT for Indian Students</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Separate hostels for Indian boys and girls</li>
                    <li>Indian food in the mess</li>
                    <li>Indian student communities and cultural activities</li>
                    <li>Affordable fees & other expenses</li>
                    <li>Quality education</li>
                    <li>Diverse Clinical exposure</li>
                    <li>Advanced medical facilities</li>
                    <li>Experienced faculty</li>
                    <li>Best practical exposure</li>
                    <li>Provided real cadaver from the very first year</li>
                    <li>NExT coaching facility</li>
                    <li>Safe & secure place to study</li>
                    <li>English is the medium of instruction which breaks the barriers of communication for international students including Indian students.</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Hostel & Food</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Fully furnished hostels with Indian mess & 24/7 security is available</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MSIT location</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>MSIT is located at Dushanbe, Tajikistan. Dushanbe is one of the most prominent national medical colleges of Tajikistan.</li>
                </ul>
            </section>

            {/* Tables outside sections */}
            <ListedTable id={eligibilityData.id} section2={eligibilityData.section2} content={eligibilityData.content} />
            <ListedTable id={academicCalenderData.id} section2={academicCalenderData.section2} content={academicCalenderData.content} />

            {/* Admission Process Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MSIT: Eligibility criteria</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Age requirement: The applicant should be 17 years of age as on 31st December in the admission year.</li>
                    <li>Academic requirements: Applicant must have passed 12th standard with at least 50% in Physics, Chemistry and Biology.</li>
                    <li>NEET requirements:  Must qualify NEET exam.</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">STEP BY STEP COMPLETE ADMISSION PROCESS</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Submission of documents 
                        <ul className="ml-[2vw] list-disc">
                            <li>10/12 marksheet</li>
                            <li>valid passport/adhaar card</li>
                            <li>NEET score card</li>
                            <li>1 passport size photograph</li>
                        </ul>
                    </li>
                    <li>Within one week, University issues admission letter.</li>
                    <li>Upon receipt of admission letter, student need to deposit $1000 (part of fees) to confirm their seat.</li>
                    <li>Once $1000 is received, university issues invitation/telex in the name of students</li>
                    <li>E-visa to be applied</li>
                    <li>Remaining fees of 1st part to be paid</li>
                    <li>Air ticket to be booked</li>
                    <li>Departure to be planned</li>
                </ul>
                <p className="text-smallTextPhone text-left md:text-regularText mt-[2vw]">The Medical Social Institute of Tajikistan (MSIT) is a smart choice for Indian students dreaming of becoming doctors at a global level. With an affordable fee structure, English-medium instruction, and a supportive environment, MSIT helps you shape a successful medical career.</p>
            </section>

            {/* Contact Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Contact Us for Admission Guidance</h3>
                <p className="text-smallTextPhone text-left md:text-regularText">Your Trusted Admission Partner for MBBS Abroad</p>
                <p className="text-smallTextPhone text-left md:text-regularText font-semibold mt-[1vw]">Edurizon Pvt. Ltd.<br/>
                111,113,115, 1st Floor, Best Arcade,<br/>
                Near KM Chowk, Sector-12,<br/>
                Dwarka, New Delhi<br/>
                +91-9540994829</p>
            </section>
        </div>
    )
}

export default MedicalSocialInstituteOfTajikistan 