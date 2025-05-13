import DescriptionComponent from "@/components/studyDestinationComponents/descriptionCompnent";
import Header from "@/components/studyDestinationComponents/headerComponent";
import ListedTable from "@/components/studyDestinationComponents/ListedTable";
import PostArrival from "@/components/studyDestinationComponents/postArrival";
import ReasonsToStudy from "@/components/studyDestinationComponents/reasonsToStudy";
import UnlistedTable from "@/components/studyDestinationComponents/unListedTable";
import UnlistedTableEqualWidth from "@/components/studyDestinationComponents/unListedTableEqualWidth";
import Image from "next/image";

const headerData={
    id:"georgia",
    title:"Study MBBS in Georgia - Best Medical Colleges in Georgia",
    title2:"",
    description:"Georgia has rapidly become one of the best country for mbbs for indian students, offering world‑class medical education.  In this comprehensive guide, you’ll discover everything you need to know about pursuing MBBS in Georgia —from affordable tuition fees, top NMC‑approved universities to the seamless admission process, eligibility criteria, documents required, student visas etc. With Edurizon by your side, you can apply now and secure a bright medical future, backed by personalized counseling.",
    description2:"Nestled between Eastern Europe and Western Asia, Georgia spans 69,700 sq km and houses a population of 3.7 million. Bordered by the Black Sea to the west, Russia to the north, Turkey and Armenia to the south, and Azerbaijan to the southeast, its strategic crossroads location has forged a rich cultural tapestry. The capital, Tbilisi, enchants with winding cobblestone lanes, pastel‑faced balconies and a seamless blend of medieval churches and modern architecture. Since its independence on April  9, 1991, Georgia has overhauled its economy and education system to become a hub for international medical students. Today, over 5,000 Indian students’ study MBBS in Georgia, drawn by its English‑medium programs, cutting‑edge technologies & infrastructure, and globally recognized degrees. "
}

const descriptionData={
    id:"geogia",
    title1normal:"Why Edurizon for MBBS in Georgia?",
    content:["At Edurizon, we guide you through every step of this journey—from free career counseling and university shortlisting to visa processing, Erasmus+ scholarships, and post‑graduation career pathways—ensuring your transition to a Georgian medical university is as smooth as it is successful."],

    content2:"",
    imageAlt:"Georgia",
    imageURL:"/assets/Images/mbbs-in-georgia/Georgia1.png"
}

const reasonToStudyData={
    id:"georgia",
    title:"Why Study MBBS in Georgia? (Key Benefits) ",
    content:[
        {title:"Affordable Education",description:"Georgia offers affordable MBBS course fees. The cost of mbbs in georgia typically ranges from Rs.4 to Rs.7 lakh per year, making it budget-friendly without compromising quality. cost of mbbs in georgia"},
        {title:"Globally Recognized Colleges",description:"All Georgia medical colleges are approved by the National Medical Commission (NMC)/WHO/FAIMER.  A Georgian MBBS is internationally recognized, allowing graduates to practice in India (after licensing exams) or pursue PG globally."},
        {title:"High FMGE/NExT Success",description:"Georgian universities boast strong preparation for the Foreign Medical Graduates Exam. Graduates have achieved impressive FMGE passing rates, thereby truly reflecting the high quality of education, training & practical exposure. With the upcoming NExT exam, the rigorous curriculum in Georgia will give you a head start in clearing it."},
        {title:"FMGE Passing ratio",description:"Foreign Medical Graduate Examination, is a prerequisite exam for all MBBS students. The FMGE passing ratio of Georgian universities varies from university to university. Overall passing ratio of Georgian universities are considered to be a good one."},
        {title:"No Donation or Entrance Exam",description:"MBBS admission in Georgia does not require any donation or capitation fee. There is no separate entrance exam; however, an interview is taken by the Universities just to check the English knowledge & confidence of students. Moreover, NEET qualification is mandatory to get the admission."},
        {title:"Safe and welcoming for Indians",description:"Georgia is known for its hospitality and safety. It ranks among the safest countries in the world, offering a secure & conducive atmosphere to study MBBS for international students. A large community of Indian students means feel at home, with celebrations of all Indian festivals and enjoy Indian cuisine."},
        {title:"European Living Standards",description:"Studying in Georgia means living in a European standard environment – safe & secure cities, clean and green campuses, reliable public transport, and a rich cultural experience. "},
        {title:"English-Medium & Modern Curriculum",description:"The entire MBBS program is taught in English."},
        {title:"Easy Admission & Visa Process",description:"The process to mbbs admission in Georgia is easy, hassle-free, and student-friendly. "},
        
    ],
    darkImg:["1Dark","2Dark","3Dark","4Dark","5Dark","6Dark","2Dark","4Dark","3Dark"],
    lightImg:["1","2","3","4","5","6","2","4","3"],
}

const academicData={
    id:"georgia",
    section2:"",
    content:{
        title:"Academic Calender",
        subTitle:"A glimpse of the important dates an aspirant must keep in mind to get on board the best medical colleges in Georgia. The information below is not absolute and may vary university-wise.",
        data:[["Events","Dates"],["Admission Process","Start in the month of May"],["Last date of application","In the month of October"],["Commencement of MBBS course","From October"]],
    }
}

const governmentUnivesitiesData={
    id:"georgia",
    section2:"",
    content:{
        title:"Top Government Universities for MBBS in Georgia",
        subTitle:"",
        description:"A glimpse of the important dates an aspirant must keep in mind to get on board the best medical colleges in Georgia. The information below is not absolute and may vary university-wise.",
        data:[["University","Facts"],["Tbilisi State Medical University (TSMU)","Georgia's most prestigious & demanding medical university."],["Akaki Tsereteli State University","Provides affordable education with a good FMGE record."],["Ivane Javakhishvili Tbilisi State University (TSU)","Internationally acclaimed MBBS programs."],["Batumi Shota Rustaveli State University","Famous for its state-of-the-art infrastructure."]],
    }
}

const georgiaFeesData={
    id:"georgia",
    section2:"",
    content:{
        title:"Fees for MBBS in Georgia",
        subTitle:"",
        description:"One of the biggest attractions of Georgia is the affordable cost of MBBS in Georgia. The MBBS in Georgia fee structure is designed to be affordable & reasonable for international students",
        data:[
            ["University", "Fees in $", "Fees in INR", "Hostel Fees in $", "Hostel Fees in INR"],
            ["Tbilisi State Medical University", "8000", "680000", "3000", "255000"],
            ["New Vision University", "7000", "595000", "3000", "255000"],
            ["David Tvildiani Medical University", "6000", "510000", "3000", "255000"],
            ["East European University", "5500", "467500", "3000", "255000"],
            ["University of Georgia", "6000", "510000", "3000", "255000"],
            ["Caucasus International University", "6000", "510000", "3000", "255000"],
            ["Bau International University", "6500", "552500", "3000", "255000"],
            ["Batumi Shota Rustaveli State University", "5000", "467500", "3300", "280500"],
            ["ALTE University", "5500", "467500", "3000", "255000"],
            ["European University", "5500", "467500", "3000", "255000"],
            ["Grigol Robakidze University", "5500", "467500", "3000", "255000"],
            ["Geomedi University", "5500", "467500", "3000", "255000"],
            ["SEU, Georgian National University", "5500", "467500", "3000", "255000"],
            ["International Black Sea University", "4900", "416500", "3000", "255000"],
            ["Batumi Shota Rustaveli State University", "4800", "408000", "3000", "255000"],
            ["Avicenna Batumi Medical University", "4000", "340000", "3000", "255000"]
        ],
    }
}

const eligibilityData={
    id:"georgia",
    section2:"",
    content:{
        title:"Eligibility Criteria",
        subTitle:"Eligibility Criteria for MBBS in Georgia for Indian students",
        data:[["Criteria","Details"],["Academic Qualification",["Class 12 (equivalent) with Phy, Chem, Bio (PCB).","General Category: Min 50% aggregate in PCB.","SC/ST/OBC: Min 40% aggregate in PCB."]],["NEET Qualification",["NEET qualification is mandatory."]],["Age Limit",["Minimum 17 years as of December 31, 2024."]]],
        href:"string;"
    }
}

const NewPage = () => {
    return(
        <div className="text-smallTextPhone md:text-smallText">
            {/* Header Part */}
            <Header id={headerData.id} title1={headerData.title} title2={headerData.title2} description={headerData.description} description2={headerData.description2} />

            {/* Description Part */}
            <DescriptionComponent id={descriptionData.id} title1normal={descriptionData.title1normal}  
            content1={descriptionData.content} imageAlt={descriptionData.imageAlt} imageSrc={descriptionData.imageURL} />

            {/* Reasons to Study */}
            {<ReasonsToStudy id={reasonToStudyData.id} title1={reasonToStudyData.title}  content={reasonToStudyData.content} darkImg={reasonToStudyData.darkImg} lightImg={reasonToStudyData.lightImg} />}

            {/* Academic Calander */}
            <div className="text-smallTextPhone md:text-regularText leading-[150%] mb-[2vw]  ">
                <ListedTable  id={academicData.id} section2={academicData.section2} content={academicData.content}/>
                <div className="mx-[6vw] md:mx-[12.5vw]">
                <h3 className="text-h5TextPhone md:text-h3Text font-bold italic leading-[120%]">Course Duration - MBBS in Georgia</h3>
                <p className="pt-[2vw] md:pt-[.5vw] pb-[2vw] md:pb-[2vw]">6 years with 1 year compulsory clinic internship</p>
                <h3 className="text-h5TextPhone md:text-h3Text font-bold italic leading-[120%]">Academic intakes for MBBS in Georgia</h3>
                <ul className="pt-[2vw] md:pt-[.5vw] list-outside  list-disc">6 years with 1 year compulsory clinic internship
                    <li className="ml-[2vw] md:ml-[1.5vw]">September-October</li>
                    <li className="ml-[2vw] md:ml-[1.5vw]">February-March</li>
                </ul>
                </div>
            </div>

            {/* Indian Opportunities */}
            <div className="md:m-[4vw] flex flex-col gap-[4vw] md:gap-[2vw] mx-[6vw] md:mx-[12.5vw]">
                <h2 className="text-h4TextPhone md:text-h2Text font-bold text-center leading-[120%]">International Opportunities</h2>
                <div className="text-smallTextPhone md:text-regularText leading-[150%] flex flex-col gap-[2vw] md:gap-[1.5vw] "> 
                    <h3 className="text-h5TextPhone and md:text-h3Text font-bold leading-[120%]">Erasmus+ and Student Exchange :-</h3>
                    <p >One of the advantages of studying in Georgia to have the opportunity to participate in exchange programs and collaborations like Erasmus</p>
                    <p ><strong>Erasmus+ Program:</strong> Georgia is a partner country in the European Union’s Erasmus+ program, which means Georgian universities can partake in student exchange with other European universities. As an MBBS student in Georgia, student could apply for a semester abroad in another country (like Germany, Italy, Poland, etc.) under Erasmus funding.</p>
                    <p ><strong>How to avail opportunities:</strong> The opportunities as mentioned above and others offered by the universities from time to time are usually applicable to only those students who perform well in their academics.</p>
                </div>
                <Image src={"/assets/Images/mbbs-in-georgia/Georgia2.png"} className="w-full h-auto mt-[2vw]" width={1420} height={690  } alt="georgia3"/>
            </div>

             {/* Top Government Universities */}
             <UnlistedTableEqualWidth  id={governmentUnivesitiesData.id} section2={governmentUnivesitiesData.section2} content={governmentUnivesitiesData.content}/>

            {/* Top 5 NMC - Approved  */}

            <div className="text-smallTextPhone md:text-regularText leading-[150%] my-[8vw] md:my-[4vw] flex flex-col gap-[3vw] md:gap-[1.5vw] mx-[6vw] md:mx-[12.5vw]">
                <h2 className="text-h4TextPhone md:text-h2Text font-bold leading-[120%] text-center">Top 5 NMC-Approved Medical<br/>Universities in Georgia</h2>
                <p className="md:text-center md:mx-[9vw]">When it comes to choosing the best university in Georgia for mbbs, Indian students have several options. Edurizon has identified five top Georgia MBBS university that highly excel in quality & recognition.</p>
                <ul className="grid grid-cols-1 md:grid-cols-5 gap-[1.5vw] font-bold pl-[3vw] md:pl-[1.5vw] list-decimal">
                    <li>Tbilisi State Medical University</li>
                    <li>David Tvildiani Medical University</li>
                    <li>East European University (EEU)</li>
                    <li>New Vision University</li>
                    <li>International Black Sea University</li>
                </ul>
           </div>

           {/* Geogia Fees */}
           <UnlistedTable id={georgiaFeesData.id} section2={georgiaFeesData.section2} content={georgiaFeesData.content}/>
           <ListedTable id={eligibilityData.id} section2={eligibilityData.section2} content={eligibilityData.content} />

            {/* Climate and Weather */}
           <div className="text-smallTextPhone md:text-regularText leading-[150%] my-[8vw] md:px-[4vw] md:my-[4vw] flex flex-col gap-[3vw] md:gap-[1.5vw] mx-[6vw] md:mx-[12.5vw]">
                <h3 className="text-h5TextPhone and md:text-h3Text font-bold leading-[120%] mb-[1vw]">Climate and Weather</h3>
                <p>Georgia’s climate is moderate and pleasant. There are four distinct seasons:</p>
                <div className="flex flex-col md:flex-row justify-center gap-[2vw] md:gap-[1.5vw]">
                    <div className="md:w-1/4 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">i.</div>
                        <div className="flex flex-col"><p className="font-bold">Autumn (Sep-Nov):</p><p>Weather is mild and cool. It’s very scenic. Light jackets suffice.</p></div>
                    </div>
                    <div className="md:w-1/4 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">ii.</div>
                        <div className="flex flex-col"><p className="font-bold">Winter (Dec-Feb):</p><p>Winters can get cold. Temperatures in Tbilisi hover around 0°C to -5°C, Good winter clothing (coat, thermals, boots) is essential. </p></div>
                    </div>
                    <div className="md:w-1/4 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">iii.</div>
                        <div className="flex flex-col"><p className="font-bold">Spring (Mar-May):</p><p>A beautiful season in Georgia – gradually warming, with flowers blooming. Temperature ranges 10°C to 20°C. A raincoat or umbrella is handy as spring showers are common.</p></div>
                    </div>
                    <div className="md:w-1/4 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">iv.</div>
                        <div className="flex flex-col"><p className="font-bold">Summer (Jun-Aug):</p><p>Summers are warm but not extreme. Tbilisi can touch 30-35°C in peak summer.</p></div>
                    </div>
                </div>
           </div>

           {/* Career Opportunity after mbbs */}
           <div className="text-smallTextPhone md:text-regularText leading-[150%] my-[8vw] md:px-[4vw] md:my-[4vw] flex flex-col gap-[3vw] md:gap-[1.5vw] mx-[6vw] md:mx-[12.5vw]">
                <h3 className="text-h5TextPhone and md:text-h3Text font-bold leading-[120%] mb-[1vw]">Career Opportunities After MBBS</h3>
                <div className="flex flex-col md:flex-row justify-center gap-[2vw] md:gap-[1.5vw]">
                    <div className="md:w-1/2 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">i.</div>
                        <div className="flex flex-col"><p className="font-bold">India</p><p>Graduates must clear FMGE or NExT (as per upcoming regulations) to practice in India. They can even opt for postgraduate studies (PG courses) or work in private hospitals.</p></div>
                    </div>
                    <div className="md:w-1/2 flex flex-row  gap-[.5vw]">
                        <div className="font-bold">ii.</div>
                        <div className="flex flex-col"><p className="font-bold">Overseas</p><p>The students may pursue residency courses in the US, UK, Canada or Europe through passing exams such as USMLE, PLAB or AMC. </p></div>
                    </div>
                </div>
           </div>

            {/* Scams and Admission Fraud Awarness */}
            <div className="p-[8vw] md:p-[4vw] flex flex-col md:flex-row gap-[4vw] md:gap-[1vw] px-[6vw] md:px-[12.5vw] items-center bg-linenChosen">
                <div className="flex flex-col gap-[2vw] md:gap-[1.5vw] ">
                <h3 className="font-bold text-h5TextPhone md:text-h3Text  leading-[120%]">Scams & Admission Fraud Awarness</h3>
                <div>
                <ul className="list-disc list-outside pl-[2vw] md:pl-[1.5vw]">
                    <li><strong>Identifying Fraud Agents:</strong> Be aware and cautious of the agents who gives you a guarantee for admission without having NEET qualification.</li>
                    <li>Under such circumstances always check an agent's credentials first.</li>
                    <li><strong>How to avoid fraudsters:</strong>
                        <ul className="list-disc pl-[2vw] md:pl-[1.5vw]">
                            <li>Verify the university's official website</li>
                            <li>Never pay high sums in cash or to personal bank accounts.</li>
                            <li>Be aware of counterfeit admission letters and forged documents.</li>
                            <li>Consult verified education consultants.</li>
                            <li>Check the testimonials.</li>
                        </ul>
                    </li>
                </ul>
                <p className="text-smallTextPhone md:text-regularText ">
                    We believe that through a thorough analysis, students can make a well-informed decision to pursue MBBS in Georgia and therefore can have a successful career in medicine.
                </p>
                </div>
                </div>  
                <Image src={"/assets/Images/mbbs-in-georgia/Georgia3.png"} className="min-w-[35vw] h-auto" width={690} height={690  } alt="georgia3"/>
            </div>

            {/* Post Arrival */}
            <PostArrival/>
            
            {/* Free MBBS Guidance & Support */}
            <div className=" my-[8vw] md:my-[0vw] flex flex-col gap-[4vw] md:gap-[2vw] mx-[6vw] md:mx-[12.5vw]">
                <h3 className="font-bold text-h5TextPhone md:text-h3Text md:text-center leading-[120%] text-orangeChosen">Free MBBS Guidance & Support</h3>
                <p className="text-smallTextPhone md:text-regularText leading-[150%]">
                From the moment you sign up with Edurizon, our services – counseling, application help, visa processing, pre-departure briefing – are designed. We aim to be your trusted partner in this life-changing journey, ensuring you make informed decisions at every step.<br/>
                Your ambition to become a doctor should not be limited by cut-throat competition or exorbitant fees. Georgia offers you a golden opportunity to pursue your MBBS in a world-class setting at an affordable cost. Thousands of Indian students have graduated from Georgia medical colleges and are now successful doctors across the world. You can join this proud list.<br/><br/>
                <strong>Over a period of time, we have sent hundreds of students for MBBS in Georgia (since 2013), out of which 300 students have already cleared FMGE & practicing in India successfully.</strong>
                </p>
            </div>

            {/* Get in Touch */}
            <div className="md:m-[4vw] my-[8vw] flex flex-col gap-[2vw] md:gap-[1vw] mx-[6vw] md:mx-[12.5vw] py-[2vw]">
                <h3 className="text-h5TextPhone md:text-h3Text md:text-center font-bold text-orangeChosen leading-[120%]">Get in Touch with Edurizon Today!</h3>
                <p className="text-smallTextPhone text-left md:w-[60vw] md:mx-auto md:text-center md:text-regularText leading-[150%]">
                Kickstart your MBBS abroad adventure. Contact Edurizon for MBBS admission assistance and take the first step towards wearing that coveted white coat. Your dream of becoming a globally qualified doctor is just an application away – let’s make it happen together!
                </p>
            </div>
        </div>
    )
}

export default NewPage;