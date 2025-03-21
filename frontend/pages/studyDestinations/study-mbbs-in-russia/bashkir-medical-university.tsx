import Breadcrumbs from "@/components/Breadcumbs";
import CTASection from "@/components/landingPage/CTASection";
import EligibilityCriteria from "@/components/studyDestinationComponents/eligibilityCriteriaTable";
import PostArrival from "@/components/studyDestinationComponents/postArrival";
import ScholarshipSection from "@/components/studyDestinationComponents/scholarshipSection";
import UnlistedTable from "@/components/studyDestinationComponents/unListedTable";
import Image from "next/image";

const services = [
    {
      icon: "/assets/Images/Icons/feesIcon.svg",
      text: "Tution Fees",
      label: "Ruble 4,90,080 / Year",
    },
    {
      icon: "/assets/Images/Icons/TieUpsIcon.svg",
      text: "City & Province",
      label: "UFA, Russia",
    },
    {
      icon: "/assets/Images/Icons/ExperienceIcon.svg",
      text: "World Rank",
      label: "Top 10 in Russia",
    },
    {
      icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
      text: "Amazing Fact",
      label: "Highest Practical Exposure",
    },
  ];

const why=["All 50,000 students who are studying and enjoying at the 2nd oldest university of Russia, Kazan Federal University knows the answer.",
"A world of thoughts, ideas, diversity and culture can be discovered from students of Kazan Federal University which was once always considered as a bridge between the students of east and west. You will be able to grow, explore yourself more, identify your talent, ability and learn many things from the outside world apart from classroom teaching.",
"Kazan Federal University is a top rated university in Russia with 215 years of experience in imparting quality education and research work in extensive field for its students.",
"More than 3000 professors are employed for providing under graduated and graduate courses. Professors are highly qualified as most of them hold either a doctorate degree or some represent powerful scientific minds in and out of Russia across the world. The whole credit goes to them as under their leadership and supervision students have excelled and become strong leaders today both in industry and studies.",
"Kazan Federal University has developed much from the last years. It has extended itself by including more research centers across the globe, well built infrastructure, 80 teaching world class laboratories, and 17 competitive research centers."]

const feeStructure={
    title:"Fee Structure",
    subTitle:"Kazan Federal University Fees",
    data:[
        ["Expense", "Annual Cost"],
        ["Tution Fees","4,90,080 Ruble"],
        ["Hostel Fees","14,000 Ruble"],
    ]
}

const facts={
    title:"Quick Facts Related to Bashkir Medical University",
    subTitle:"",
    data:[
        [],
        ["Established In","1909"],
        ["Recognition","NMC, WHO, ECFMG (USMLE), GMC (PLAB), AMEE"],
        ["Fees","2,82,080 per year"],
        ["Medium of Teaching","1Fully English"],
        ["Course Duration","6 Years"],
        ["Indian students","Yes"],
        ["University Ranking","Top 10 in Russia"]
    ]
}

const eligibility=[
    
        [["Criteria"],["Details"]],
        [["Academic Qualification"],["Above 50% in 10+2, PCBE."]],
        [["NEET Qualification"],["NEET Score - Just Qualify."]],
        [["Age Limit"],["Age should be 17 years as on 31st December in the year of seeking admission."]],
        [["University Exam"],["Qualify the university exam."]],
]



const BashkirMedicalUniversity=()=>{
    return <div>
        <div className="relative h-auto w-full">
        <Image src="/assets/Images/kazanFederalUniversity.webp" alt="Kazan Federal University" layout="fill" objectFit="cover" className="z-[-1] opacity-50" />
        <div className="w-[73.125vw] flex flex-col gap-[6vw] py-[7.125vw] items-center mx-auto">
            <div className="flex flex-col items-center gap-[2vw]">
            <div className="flex flex-col items-center gap-[1vw]">
                <Breadcrumbs/>
                <h1 className="text-h1Text font-bold">Bashkir Medical University</h1>
            </div>
            <p className="text-regularTexts text-center">
            Established in 1932,Bashkir State Medical University located at Ufa is one of the top and leading institutions of Russia and the center of the medical and pharmaceutical sciences of the Republic of Bashkortostan.
            </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.25vw]  md:gap-[1.125vw] items-center px-[5vw] md:p-[.5vw] justify-center">
              {services.map((item, index) => (
                <div key={index} className="w-[37.5vw] md:w-[16.5vw] h-[29.25vw] md:h-[12.875vw] relative shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                            rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex flex-col items-center justify-start py-[3vw] 
                            md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
                  <Image src={item.icon}
                    alt={item.label} width={64} height={64} className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative  overflow-hidden shrink-0" />
                  <p className="text-center leading-[150%]"> {item.text} <br /><span className="font-semibold"> {item.label}</span></p>
                </div>
              ))}
            </div>
        </div>
        </div>

        <div className="mx-[12.5vw] my-[4vw]">
            <p className="text-regularText font-semibold leading-[150%] text-justify">
            Initially the University started with only one Faculty that is Faculty of General Medicine. But later in 1961, it extended itself to Faculty of pediatrics and Faculty of Preventive Medicine in 1970 which was later renamed to Faculty of Preventive Medicine and Microbiology. Two more faculties - Faculty of Dentistry and Faculty of Pharmacy were extended by 1976 -1981.<br/><br/>
            The University receives a good number of medical enrollments from all over the world. The medical college at BSMU along with medicine also offers vocational secondary education in specialist of Nursing and Prosthetic Dentistry. Among 8000 medical students, more than 850 are International students from about 40 countries and 1000 are clinical residences and PHD Programs along with 7000 postgraduate professional trainings.<br/><br/>
            Bashkir State Medical University is known for offering intense research work facilities for medical students along with simulation- based training for clinical residents and physicians which is equipped with state of the art simulators where they can enhance their practical skills in anesthesiology, resuscitation, neonatology, endoscopy, gynecology, obstetrics, and neurosurgery.<br/><br/>
            The University has a variety of scientific infrastructure within the campus and that includes Cell Culture Laboratory, Central Scientific Research Laboratory, Vivarium, Scientific Research Institute Rehabilitation Medicine, Scientific Research Institute of Oncology and laboratory of experimental surgery. It has also cooperated with RUSNANO’S Pet Center for training specialist of nuclear medicine. The University has a large library for its medical students which can store about 527000 books and medicine and is counted as one of the best medical libraries in Russia.<br/><br/>
            Bashkir State Medical University is also known to receive many accolades for training more than 700 Volunteers for winter Olympic and Paralympic Games in 2014 in Sochi. The University has also been awarded with the title of “Best Medical University” in Russia by the Russian National Public Organization “League of the Best”. The University has also been awarded with the title of “Best Medical University” in Russia by the Russian National Public Organization “League of the Best”.
            </p>
            <br/>
            <ul className="list-disc list-inside">
                <li>
                BSMU is amongst the top universities of the Russian Federation.
                </li>
                <li>
                Government funded university.
                </li>
                <li>
                Recognized by the leading medical council MCI
                </li>
                <li>
                Recognized by WHO.
                </li>
                <li>
                Recognized by Ministry of Healthcare and Ministry of Education and Science of the Russian Federation.
                </li>
            </ul>
        </div>
        <div className="grid grid-cols-2 gap-[5vw] mx-[12.5vw] my-[4vw]">
            <div className="flex flex-col gap-[2vw] justify-center">
                <h3 className="text-h3Text font-bold leading-[120%]">
                    The City <br/> <span className="text-orangeChosen">Kazan</span>
                </h3>
                <p className="text-regularText leading-[150%] text-justify">
                The history of Kazan situated in the center of Europe which is a multinational and multifessional city of Russia is filled with millennium past record. The university is very easily reachable by underground metro from the dormitory. The city is also well known around the world for many cultural events and international sport like universaide 2013 (world student games) FINA World Acquatics Championships 2015, International Classical Ballet and Opera Festivals, International Festival of Muslim Cinema and 21st FIFA World Cup (2018).
                </p>
            </div>
            <Image src="/assets/Images/kazanFederalCity.webp" alt="Kazan Federal City" width={500} height={500} className="w-[32.375vw] h-auto" />
        </div>

        <div className="px-[12.5vw] w-full bg-linenChosen grid grid-cols-2 items-center py-[4vw] gap-[2vw]  my-[4vw]">
            <div className="flex flex-col gap-[2vw] justify-center">
                <h2 className="text-h2Text font-bold leading-[120%]">Why MBBS in Kazan Federal University?</h2>
                <ul className="list-disc pl-[2vw] text-regularText leading-[150%] text-justify">
                    {why.map((item,index)=>(
                        <li key={index} >{item}</li>
                    ))}
                </ul>
            </div>
            <Image src="/assets/Images/CountryBlogs/didYouKnow.png" alt="Did You Know" width={500} height={500} className="w-[30.5vw] h-auto mx-auto" />
        </div>
        <div className=""> 
        <UnlistedTable id="1" section2="fee" content={feeStructure}/>
        </div>
        <div>
        <div className=" flex flex-col  mx-[12.5vw] gap-[2vw] py-[4vw] mb-[4vw]">
            <div className="flex flex-col gap-[1vw]">
            <h3 className="text-h5TextPhone md:text-h3Text text-center font-bold leading-[130%]">Kazan Federal University Entrance Exam</h3>
            <p className="text-smallText text-center ">Kazan Federal Conducts entrance exams in respect to all international students, including Indians, every year.</p>
            </div>
            <div className="flex flex-col gap-[1vw]">
                <h4 className="text-h4Text font-bold text-left">Kazan Federal University Entrance Exam Sample Paper</h4>
                <ul className="text-regularText list-disc list-inside">
                    <li>The subjects for the entrance exams are English & Biology.</li>
                    <li>It is mandatory to get qualified in each subject.</li>
                    <li>It is expected that, this year, qualifying marks will be lower as Chemistry subject has been exempted.</li>
                </ul>
            </div>
        </div>
        
        <EligibilityCriteria id="1" data={eligibility} countryName="Kazan Federal University"/>
        

        <div className="mb-[4vw]"> 
        <UnlistedTable id="1" section2="fee" content={facts}/>
        </div>


        </div>
        <PostArrival/>
    </div>
}

export default BashkirMedicalUniversity;