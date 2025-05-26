import ListedTable from '@/components/studyDestinationComponents/ListedTable'
import React from 'react'

const academicCalenderData = {
    id: "nepal",
    section2: "",
    content: {
        title: "Academic Calendar",
        subTitle: "A glimpse of the important dates an aspirant must keep in mind to get admission in Janaki Medical College in Nepal.",
        data: [["Events", "Dates"],
        ["Admission process", "Starts in the month of May"],
        ["Date of Registration", "July/August"],
        ["Commencement of MBBS course", "From December"]],
    }
}

const eligibilityData = {
    id: "nepal",
    section2: "",
    content: {
        title: "Eligibility Criteria",
        subTitle: "Eligibility Criteria for MBBS in Nepal for Indian students",
        data: [["Criteria", "Details"],
        ["Academic Qualification", ["Class 12 (equivalent) with Phy, Chem, Bio (PCB).", "General Category: Min 50% aggregate in PCB.", "SC/ST/OBC: Min 40% aggregate in PCB."]],
        ["NEET Qualification", ["NEET qualification is mandatory."]],
        ["Age Limit & Other information", ["Minimum 17 years as on the date of admission", "Only current academic year NEET is accepted.", "General category NEET score is considered for Indian student.",
            "Fees to be deposited directly in the account of Janaki Medical College after getting admission letter.",
            "Students will also have to undergo a counselling/interview held by the MEC."
        ]]],
    }
}

const services = [
    {
        icon: "/assets/Images/Icons/feesIcon.svg",
        text: "Tuition Fees",
        label: "44L",
    },
    {
        icon: "/assets/Images/Icons/ExperienceIcon.svg",
        text: "",
        label: "Recognition by WHO, NMC",
    },
    {
        icon: "/assets/Images/Icons/TieUpsIcon.svg",
        text: "City & Province",
        label: "Janakpur, Madhesh",
    },
    {
        icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
        text: "Country Ranking",
        label: "17",
    },
];

import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcumbs'
import { TransitionLink } from '@/utils/TransitionLink';

const JanakiMedicalCollege = () => {
    const callBtnFnc = () => {
        window.location.href = "tel:+919873381377"
    }
    const whatsappBtnFnc = () => {
        window.open('https://wa.me/919873381377?')
    }
    return (
        <div>
            <div className="flex flex-col gap-[2vw] mb-[1vw] py-[4vw] items-center">
                <div className="mx-[6vw] flex flex-col items-center gap-[2vw] md:gap-[2vw]">
                    <Breadcrumbs />
                </div>
                <div className='bg-linenChosen flex flex-col md:flex-row gap-[3vw] items-center w-full'>
                    <Image className='w-full md:w-[40.625vw] h-full' src={"/assets/Images/mbbs-in-nepal/janaki-medical-college.png"} alt='Janaki Medical College' width={650} height={550} />
                    <div className='relative mx-[6vw] md:mx-0 py-[4vw]'>
                        <h2 className='font-bold text-h3TextPhone md:text-h2Text leading-[120%] mb-[2vw] md:mb-[1.5vw]'>Janaki Medical College</h2>
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
                            <button onClick={callBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[10vw] md:rounded-[.675vw] p-[10px]'>+91 98733 81377</button>
                            <button onClick={whatsappBtnFnc} className='bg-orangeChosen md:h-[3vw] w-[12vw] md:rounded-[.675vw] flex items-center justify-center p-[10px] gap-[2vw] md:gap-[.5vw]'><Image src={"/assets/Images/Icons/whatsapp.png"} alt='whatsapp' width={40} height={40} /> +91 98733 81377</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text md:text-center text-left mb-[4vw] md:mb-[1vw]">About Janaki Medical College</h3>
                <ul className="list-disc ml-[3vw] md:ml-[1.5vw] text-smallTextPhone text-left md:text-regularText md:text-justify">
                    <li>Janaki Medical College was established in the year 2003 with an annual intake of 80 students a year to a Bachelor of Medicine and Bachelor of Surgery program.</li>
                    <li>In addition to Bachelor of Medicine & Bachelor of Surgery program, Janaki Medical college also offers nursing courses at an affordable fee structure.</li>
                    <li>In the year 2020, the college created a Post Graduate program in department of Surgery and department of Emergency Medicine.</li>
                    <li>Janaki Medical College is affiliated to Tribhuvan University Institute of Medicine and regulated by Nepal Medical Council.</li>
                    <li>It is managed by the Ram Janaki Health Foundation which is registered under the Nepalese Companies Act.</li>
                </ul>
            </section>

            {/* Operations Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text text-left">Janaki Medical College - Operations</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Janaki Medical college operates two hospitals:
                        <ul className='text-smallTextPhone list-none ml-[3vw] md:ml-[1.5vw] text-left md:text-smallText md:text-justify'>
                            <li>i. A smaller 150 bed hospital at Ramaidaiya Bhawadi</li>
                            <li>ii. A large 350+ bed hospital at Bramhapuri, Janakpur, Nepal</li>
                        </ul>
                    </li>
                    <li>It provides healthcare education in association with Tribhuvan University Institute of Medicine and regulated by Nepal Medical Council.</li>
                    <li>It is managed by the Ram Janaki Health Foundation which is registered under the Nepalese Companies Act.</li>
                </ul>
                
                <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text text-left">Janaki Medical College - Programs</h3>
                <p className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    Janaki Medical College (JMC) situated in Janakpur, Dhanusha, Nepal has been an initiative of Ram Janaki Health Foundation Pvt. Ltd to provide health education and healthcare services through its competent professionals in medical academia.
                </p>
            </section>
                            

            {/* Mission and Vision Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College - Mission</h3>
                <p className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    To demonstrate exemplary leadership in the field of medical education, health care services and research by evolving into a deemed university.
                </p>

                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College - Vision</h3>
                <p className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    JMC aspires to be a center of excellence for medical education, services & research.
                </p>

                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College - Goals</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Offer world class medical education.</li>
                    <li>Enhance research culture in par with national and international contemporaries.</li>
                    <li>Become Nepal's leading partnership in medical education.</li>
                    <li>Promote self-sustainability of institution.</li>
                </ul>

                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College - Objectives</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>To provide quality education for different level of medical, dental, nursing and allied health streams through highly qualified professionals.</li>
                    <li>To diversify academic programs par to the demand of changing educational preferences of students.</li>
                    <li>To deliver patients-oriented services at affordable cost using cutting edge technology through highly qualified professionals.</li>
                    <li>To support government for the implementation of national health policies and programs.</li>
                    <li>To upgrade diagnostic services with globally recognized technologies.</li>
                    <li>To deliver preventive, promotive, curative and rehabilitative services as per the need of communities.</li>
                </ul>
            </section>

            {/* Why Choose Section */}
            <div className="p-[8vw] md:p-[4vw] flex flex-col md:flex-row px-[6vw] md:px-[12.5vw] gap-[5vw] md:gap-[2vw] mb-[10vw] md:mb-[4vw] items-center bg-linenChosen">
                <div className="flex flex-col gap-[2vw] md:gap-[1vw]">
                    <h3 className="font-bold text-h5TextPhone md:text-h3Text leading-[120%]">Why Choose Janaki Medical College?</h3>
                    <ul className="text-smallTextPhone md:text-regularText list-disc list-outside pl-[2vw] md:pl-[1.5vw]">
                        <li>Janaki Medical College, Tribhuvan University holds a premier position within Nepal's Medical Environment.</li>
                        <li>Students become part of our extensive community of scholars, clinicians and stakeholders, who provide world class medical education.</li>
                        <li>Expert faculty with years of experience in medical education.</li>
                        <li>Commitment to evidence-based teaching methodologies.</li>
                        <li>State-of-the-art resources and technology for medical training.</li>
                        <li>Lowest fees amongst all medical colleges in Nepal.</li>
                        <li>No passport required for Indian students.</li>
                        <li>No visa required for Indian students.</li>
                        <li>Good patient flow and high in-patient bed occupancy.</li>
                        <li>Teaching & learning is in English medium.</li>
                        <li>Disease spectrum is similar to India.</li>
                        <li>Huge clinical practice opportunities.</li>
                        <li>Syllabus, books, teaching & learning methodology & medicine used are similar to India.</li>
                        <li>After MBBS, students are eligible to appear in US-MLE.</li>
                        <li>Environment, Culture, food habits and living expenses are similar to India.</li>
                        <li>Separate hostel for boys and girls with appropriate CCTV monitoring.</li>
                    </ul>
                </div>
                <Image src={"/assets/Images/mbbs-in-nepal/nepal2.png"} className="ml-auto w-full md:w-[32.5vw] h-auto" width={690} height={690} alt="Janaki Medical College Campus" />
            </div>

       

            {/* Recognition Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
            <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MBBS Programme in Janaki Medical College</h3>
                <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">
                
                Janaki Medical College Provides World Class Health Professional Education to make a meaningful contribution in producing the best Doctors. Janaki Medical college offers following programs:
                </p>
            
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Bachelor of Medicine & Bachelor of Surgery (MBBS)</li>
                    <li>Post Graduate - MD/MS</li>
                    <li>Bachelor of Nursing</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College – Recognition</h3>
                <ul className="text-smallTextPhone  mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Janaki Medical College is recognized by international organizations such as WHO, NMC which attracts international students from all around the world to Study MBBS at Janaki Medical College.</li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">About MEC</h3>
                <ul className="text-smallTextPhone   text-left md:text-regularText md:text-justify">
                    <li>Medical Education Commission, Nepal is the final body for admission in Nepal</li>
                </ul>
            </section>

            
            {/* At a glance Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Janaki Medical College at a glance</h3>
                <ul className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] text-left gap-x-[1vw] md:text-regularText md:text-justify grid grid-cols-2">
                    <li className='font-bold'>o	College name</li>
                    <li>Janaki Medical College</li>
                    <li className='font-bold'>o	University affiliation</li>
                    <li>TU</li>
                    <li className='font-bold'>o	Recognition</li>
                    <li>WHO, NMC</li>
                    <li className='font-bold'>o	Medium of instruction</li>
                    <li>English</li>
                    <li className='font-bold'>o	Course duration</li>
                    <li>4.5 years</li>
                    <li className='font-bold'>o	Internship duration</li>
                    <li>1 year</li>
                    <li className='font-bold'>o	NEET</li>
                    <li>Mandatory</li>
                    <li className='font-bold'>o	Country Ranking</li>
                    <li>17</li>
                    <li className='font-bold'>o	Intake</li>
                    <li>September</li>
                    <li className='font-bold'>o	Location</li>
                    <li>Janakpur, Nepal</li>
                    <li className='font-bold'>o	Official Website</li>
                    <li><a href="https://www.janakimedicalcollege.edu.np/" target='_blank' rel='noreferrer'>info@janakimedicalcollege.edu.np</a></li>
                </ul>
            </section>

            {/* Eligibility Criteria */}
            <ListedTable id={eligibilityData.id} section2={eligibilityData.section2} content={eligibilityData.content} />

            {/* Academic Calendar */}
            <ListedTable id={academicCalenderData.id} section2={academicCalenderData.section2} content={academicCalenderData.content} />


            {/* Location and Climate Section */}
            <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
            <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">How to reach Janaki Medical College</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>By Road:
                        <ul className='text-smallTextPhone list-none ml-[3vw] md:ml-[1.5vw]'>
                            <li>i. Frequent bus services operate between Janakpur and other Nepalese cities.</li>
                            <li>ii. Buses operate from Sitamarhi, Patna, Delhi and Ayodhya.</li>
                            <li>iii. 30 KM from Bithamore, Bihar border.</li>
                        </ul>
                    </li>
                    <li>By Rail:
                        <ul className='text-smallTextPhone list-none ml-[3vw] md:ml-[1.5vw]'>
                            <li>i. Jaynagar–Bardibas railway line connects Janakpur to Siraha at the Nepal-India border.</li>
                            <li>ii. Nepal Railways operates a service between Janakpur and Jainagar (Madhubani district, Bihar).</li>
                        </ul>
                    </li>
                    <li>By Air:
                        <ul className='text-smallTextPhone list-none ml-[3vw] md:ml-[1.5vw]'>
                            <li>i. Janakpur has a domestic airport with most flights connecting to Kathmandu.</li>
                        </ul>
                    </li>
                </ul>
                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Location and Climate</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Janaki Medical College is situated in Janakpur, which is the capital city of Madhesh Province.</li>
                    <li>Located about 225 km southeast of Kathmandu.</li>
                    <li>Located about 23 km from the Bhitthamore border with India.</li>
                    <li>Climate is humid subtropical:
                        <ul className='text-smallTextPhone list-none ml-[3vw] md:ml-[1.5vw]'>
                            <li>i. March and April are generally hot, dry, and windy.</li>
                            <li>ii. May to September is wet.</li>
                            <li>iii. October to November a mild, dry autumn.</li>
                            <li>iv. December to February cold.</li>
                        </ul>
                    </li>
                    <li>The major rivers surrounding Janakpur are the Dudhmati, Jalad, Rato, Balan, and Kamala.</li>
                </ul>

                <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Language and Culture</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] mb-[4vw] md:mb-[1vw] text-left md:text-regularText md:text-justify">
                    <li>Maithili is widely spoken in the area as the first language and is also used as the lingua franca.</li>
                    <li>Nepali, Hindi, Marwari, Bhojpuri, Awadhi and English are well understood.</li>
                    <li>More than 90 percent of the total population is Hindu, with the rest being Muslims and Buddhists.</li>
                </ul>
            </section>
             {/* Document and Popular Colleges */}
             <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
                <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Janaki Medical College Admission Process</h3>
                <p className='text-smallTextPhone text-left md:text-regularText md:text-justify '> Students who meet the eligibility criteria can follow some easy steps to complete the admission process at B & C Medical College. </p>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify mb-[4vw] md:mb-[1vw]">
                    <li>Submission of all relevant documents</li>
                    <li>Fill out application form.</li>
                    <li>Document verification.</li>
                    <li>Get an Admission Letter from the University.</li>
                    <li>Pay admission fees.</li>
                    <li>Submission of passport and other documents required.</li>

                </ul>
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Required Documents for Janaki Medical College</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify mb-[4vw] md:mb-[1vw]">
                    <li>10th & 12th mark sheet</li>
                    <li>Aadhaar card/voter ID</li>
                    <li>Passport (if ready)</li>
                    <li>Birth certificate</li>
                    <li>Passport-sized photographs</li>
                    <li>Documents should be apostilled by the ministry of external affairs</li>
                    <li>All documents need to be legalized by the Nepali embassy</li>
                </ul>
               
              <h3 className="text-h6TextPhone leading-[120%]  md:text-h5Text text-left">Other popular Colleges for MBBS in Nepal</h3>
                <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify underline">
                    <li> <TransitionLink href='nepal-medical-college'>Nepal Medical College</TransitionLink></li>
                                       <li><TransitionLink href='b&c-medical-college'>B&C Medical College</TransitionLink></li>
                                        <li><TransitionLink href='nobel-medical-college'>Nobel Medical College</TransitionLink></li>
                                        <li><TransitionLink href='kist-medical-college'>KIST Medical College</TransitionLink></li>
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

export default JanakiMedicalCollege 