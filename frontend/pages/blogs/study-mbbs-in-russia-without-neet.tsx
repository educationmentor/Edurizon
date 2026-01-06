import DescriptionComponent from '@/components/studyDestinationComponents/descriptionCompnent'
import Header from '@/components/studyDestinationComponents/headerComponent'
import ReasonsToStudy from '@/components/studyDestinationComponents/reasonsToStudy'
import WhyChoseUniversity from '@/components/studyDestinationComponents/whyChoseUniversity'
import React from 'react'
import Image from 'next/image'
import UnlistedTable from '@/components/studyDestinationComponents/unListedTable'
import ListedTable from '@/components/studyDestinationComponents/ListedTable'
import UnlistedTableEqualWidth from '@/components/studyDestinationComponents/unListedTableEqualWidth'
import AdmissionProcess from '@/components/studyDestinationComponents/admissionProcess'
import EdurizonProcess from '@/components/studyDestinationComponents/EdurizonProcess'

const eligibilityTable = {
  title:"Eligibility Criteria for MBBS in Russia Without NEET",
  subTitle:"",
  description:"To secure admission to an MBBS program in Russia, you must meet certain basic eligibility criteria:",
  data:[
    ["Criteria","Details"],
    ["Academic Qualifications","You should have completed 10+2 (Higher Secondary) with Physics, Chemistry, Biology, and English as your core subjects. A minimum of 50% aggregate in PCB is typically required for general category students (40% for reserved categories)​. This ensures you have a strong foundation in science subjects."],
    ["Age Requirements","You must be at least 17 years old by 31st December of the admission year​. There is usually no upper age limit for MBBS in Russia as long as other criteria are met."],
  ]
}

const tableData = {
  title:"Top 10 Ausbildung Courses in Germany",
  subTitle:"",
  data:[
    ["Course","Duration","Average Salary","Employers Hiring"],
    ["IT Specialist","3 years","€1,200–€1,500","SAP, Siemens, Deutsche Telekom"],
    ["Nursing","3 years","€1,000–€1,300","Charité, Asklepios"],
    ["Mechatronics Technician","3.5 years","€1,100–€1,400","BMW, Bosch, Volkswagen"],
    ["Hotel Management","2 years","€900–€1,200","Marriott, Hilton"],
    ["Industrial Electrician","3 years","€1,100–€1,300","BASF, ThyssenKrupp"],
    ["Aircraft Mechanic","3.5 years","€1,300–€1,500","Lufthansa, Airbus"],
    ["Baking & Confectionery","3 years","€800–€1,000","Kamps, Dallmayr"],
    ["Pharmaceutical Assistant","3 years","€1,000–€1,200","Bayer, Merck"],
    ["Dental Assistant","3 years","€950–€1,100","Dental Praxis Networks"],
    ["Retail Management","2 years","€900–€1,100","Aldi, Lidl, MediaMarkt"],
  ]
}

const tableData2 = {
  title:"Detailed Eligibility & Requirements of Ausbildung in Germany",
  subTitle:"",
  data:[
    ["Course","Duration"],
    ["Academic Qualification",["School Certificate: Equivalent to German secondary education (e.g., Class 12 for Indians).","Indian Students: CBSE/ICSE/State Board certificates accepted after recognition via the Anabin Database."]],
    ["Field-Specific Requirements",["Nursing: Biology/Chemistry basics.","IT Ausbildung: Mathematics/Computer Science background."],],
    ["Language Proficiency",["German: B1/B2 for most programs (exceptions for English-taught IT/Engineering).","English: IELTS 5.5+ or equivalent for English-medium courses."]],
    ["Training Contract",["Secure a contract with a German employer (Ausbildungsvertrag).","Edurizon’s Support: We partner with 200+ companies to match students."]],
    ["Financial Proof",["Blocked Account: Minimum €11,208/year (as per 2023 visa rules).","Health Insurance: Mandatory coverage (€110–€120/month).wb"]],
  ]
}

const highestPaidTable = {
  title:"Highest-Paid Ausbildung in Germany",
  subTitle:"",
  data:[
    ["Course","Average Salary","Post-Training Salary"],
    ["IT Specialist","€1,200–€1,500","€45,000–€60,000/year"],
    ["Industrial Electrician","€1,100–€1,300","€50,000–€65,000/year"],
    ["Aircraft Mechanic","€1,300–€1,500","€40,000–€55,000/year"],
    ["Pharmaceutical Assistant","€1,000–€1,200","€38,000–€48,000/year"],
  ]
}

const benefitsToStudy = [
  {
    title: "No Entrance Exam Hassles",
    description:
        "You can secure admission without the stress of intense entrance exams. Apart from NEET qualification (which is needed for eventual practice in India), Russian universities do not require additional tests like IIT-JEE or MCAT. The admissions are mostly merit-based on your Class 12 marks. This is a huge relief for students who find the competition in India overwhelming​.",
  },
  {
  title: "No Donation or Capitation",
  description:
      "Unlike certain private institutions elsewhere, Russian universities do not require any donation for admission​. The process is transparent – if you meet the criteria and there’s a seat, you get in by paying the standard fee. This opens opportunities based on merit and willingness, not on extra payments.",
  },
  {
    title: "Low Cost of Living",
    description:
        "Living expenses in Russia are relatively low. Many universities offer on-campus hostels, which are subsidized, and the cost of food and transport is quite reasonable. Indian students typically spend around USD $100–$200 monthly on living expenses​, roughly ₹8,000–₹16,000. Even in big cities like Moscow, careful budgeting can keep living costs manageable. The affordable fees and living costs make Russia a budget-friendly choice for MBBS.",
  },
  {
    title: "Quality Education & Global Recognition",
    description:
        "Russian medical universities are known for their rigorous academic standards and emphasis on practical training​. The curriculum is designed to meet international standards, and the universities have modern laboratories, hospitals for clinical rotations, and experienced faculty. The MBBS degree from Russia is globally recognized – most universities are listed in the World Health Organization (WHO) directories. They are recognized by the National Medical Commission (NMC) of India and other global medical bodies​. This means you can practice in India (after the licensing exam) or pursue post-graduate education in countries like the USA, UK, etc.",
  },
  {
    title: "Multicultural and Safe Environment",
    description:
        "Russia hosts thousands of international students every year. You’ll be studying in a multicultural environment with peers from many countries. This exposure broadens your perspective and builds a global network of friends. Moreover, Russian campuses and cities hosting many students (like Moscow, St. Petersburg, Kazan, etc.) are generally safe and student-friendly. Universities often have dedicated support for international students to help them settle in – from finding Indian food (yes, many places have Indian mess/canteens!) to celebrating festivals. It’s an opportunity to experience a new culture while feeling supported​.",
  },
  {
    title: "Affordable Tuition Fees",
    description:
        "Medical education in Russia is much more affordable than private medical colleges in India or other countries. On average, tuition fees range from USD $4,000 to $6,000 annually (approximately ₹3–5 lakhs per year)​ – significantly lower than a private MBBS seat in India would cost. Many good universities have total course packages in the range of ₹15–₹30 lakhs for the entire 6-year program, making it cost-effective. Plus, no capitation fees or donations are required​, just the standard tuition and nominal administrative fees.",
  },
  {
    title: "Good Infrastructure and Campus Facilities",
    description:
        "Most top medical universities in Russia have state-of-the-art infrastructure – well-equipped labs, simulation centers, vast libraries, and hospital tie-ups for clinical training. You’ll get plenty of hands-on practice, which is crucial for a medical education​. Additionally, facilities like sports complexes, student clubs, and events ensure a wholesome experience beyond academics.",
  },
  {
    title: "English-Medium Programs",
    description:
        "A major benefit is that many Russian universities offer MBBS courses in English. This helps international students grasp medical concepts without the added challenge of learning a new language in the classroom​. (Of course, you will learn basic Russian alongside, especially to communicate with patients during clinical years, but the primary teaching can be in English.) For academics, not having to learn an entirely new language is a relief and lets you focus on medicine.",
  },
  {
    title: "Opportunity to Pursue Your Dream",
    description:
        "Perhaps the biggest benefit is that studying MBBS in Russia offers a second chance to passionate students who couldn’t clear NEET with high ranks. You don’t have to give up on your dream of becoming a doctor. Russia’s flexible admission (including MBBS without NEET) provides an avenue to achieve your goals. You can always attempt NEET later or focus on the screening exam after graduation. What matters is getting the medical education you desire and a recognized degree.",
  },
                            
]

const challengesToStudy = [
  {
    title: "NEET and Licensing",
    description:
        "As emphasized, not having a NEET qualification may pose a hurdle when you want to practice in India. The National Medical Commission (NMC) in India requires foreign medical graduates to have qualified NEET in the year of admission abroad​. If you go without NEET, you might have to clear it at some point or show eligibility to be allowed to take the FMGE/NExT (the screening test for practicing in India). Failing to do so could mean your Russian degree isn’t valid for a license in India.",
  },
  {
  title: "Language Barrier",
  description:
      "While classes may be in English, remember that Russian is the local language. You will need to learn basic Russian for daily life (buying groceries, traveling) and, importantly, for clinical interactions with hospital patients. This can be challenging if you’ve never studied a foreign language. Most universities offer language classes in the first year to help, but it takes effort from your side to become conversant. Embrace the opportunity to learn Russian – it will enrich your experience, though it might be tough initially.",
  },
  // {
  //   title: "Solution",
  //   description:
  //       "Consider attempting NEET again while studying in Russia (many students do this in the first or second year and secure the needed score)​. Also, ensure you attend a well-recognized university and prepare thoroughly for the FMGE/NExT exam, which you’ll take after graduating. Edurizon can guide you on the latest NMC rules and connect you with coaching resources for the licensing exam.",
  // },
  {
    title: "Quality of Education",
    description:
        "Not all universities are equal. While there are many excellent institutions, some lesser-known or very low-cost colleges might not offer the same education or facilities. It’s crucial to research the university thoroughly before enrolling​. Look at factors like faculty experience, patient exposure, licensing exam pass rates of graduates, etc. Edurizon helps evaluate and recommend only those institutions that have a strong track record with Indian students. It’s also beneficial to talk to current students or alumni, if possible, to get on-ground feedback.",
  },
  {
    title: "Climate and Lifestyle",
    description:
        "Russia can be very cold. Winters are long and harsh in many parts of Russia, with some regions dropping to -20°C or below. Adapting to a new climate is a physical and mental challenge – you’ll need warm clothing and a mindset to get through dark winters. On the flip side, Russian winters can be beautiful, and you’ll likely experience snow for the first time! Be prepared for shorter days in winter, and utilize indoor time for study or recreation. Culturally, Russia might differ from what you’re used to – food, holidays, social norms. There might be an initial culture shock, but most Indian students adjust well by forming friendships and staying connected with the Indian community there.",
  },
  {
    title: "Homesickness and Mental Adjustment",
    description:
        "Being away from home for 5-6 years is no small feat. It requires emotional maturity and independence. You might feel homesick, especially in the first few months. The food is different (though you will find ways to get Indian food via restaurants or cooking), and you’ll miss family during festivals. It’s important to be mentally prepared and stay determined about your goal. The good part is that you will not be alone – you’ll have many fellow Indian students and friendly locals around, and technology (video calls, WhatsApp) makes it easy to stay in touch with family. Many students return to India during summer vacations every year, which helps beat homesickness.",
  },
  {
    title: "Financial Management",
    description:
        "Though Russia is affordable compared to alternatives, managing finances independently is a new responsibility. You must budget your monthly expenses, ensure fees are paid on time each year, and handle currency exchange. Sometimes, the Ruble exchange rate can fluctuate, which might affect the cost slightly year to year. Always have an emergency fund or a way to access additional money if needed. Als,o, if you decide to do an internship or observership abroad or any extra coaching, those might be additional costs. Planning finances with your family beforehand will save you stress later.",
  },
  {
    title: "Geopolitical Factors",
    description:
        "While Russia is generally a stable country for students, it’s always wise to stay informed about geopolitical situations (such as international sanctions or diplomatic issues) that could indirectly affect foreign students. For example, currency value changes or flight availability are small things that can be impacted. In recent times, there has been global news involving Russia; none of it has targeted students, but being aware helps in planning (like ensuring you have a safe travel route, etc.). The Indian Embassy in Russia is active and supportive – always register with the Indian Embassy on arrival. Having the embassy’s contact and following their advisories is a good practice for any student abroad.",
  },
  {
    title: "Post-Graduation Plans",
    description:
        "Think ahead to what you want to do after MBBS. If you aim to return to India, you’ll focus on clearing the FMGE/NExT exam. If you are considering pursuing USMLE (for the USA) or PLAB (for the UK) after MBBS, you must prepare for those alongside your studies. Russian MBBS is accepted in many countries, but you must clear the requisite exams. The challenge here is time management – studying for your university exams while keeping an eye on these licensing exams. It’s doable with dedication (many have done it), but keep this in mind so you can plan your study strategy accordingly.",
  },
                            
]



const StudyMbbs = () => {
  return (
    <div className='flex flex-col gap-[5vw] md:gap-[5vw] '>
      <Header title1="Study MBBS in Russia Without NEET:"  title2='Your Complete Guide for 2024' id='' description='Are you an aspiring medical student who struggled with NEET or worried about not qualifying? Don’t lose hope! Studying MBBS in Russia without NEET is an alternative path many Indian students are exploring. Russian medical universities offer quality education, global recognition, and affordable fees – and some even admit students without a NEET score. This comprehensive guide will cover all the essential information – from eligibility and top universities to the admission process, costs, and how Edurizon can help you pursue your dream of becoming a doctor.' />
      
      
      {/* Eligibility Criteria Table */}
      <UnlistedTableEqualWidth id='' section2='' content={eligibilityTable}/>
      
      <DescriptionComponent id='' title1normal={"Here’s the big question:"} title1orange={"Is NEET required?"} content1={["Technically, Russian universities do not mandate a NEET qualification for admission. You can get admitted based on your 12th-grade marks alone, without clearing NEET. However, Indian regulations (NMC) state that Indian students must qualify for NEET to pursue MBBS abroad and later practice in India​. In fact, according to the Embassy of India in Moscow, qualifying for NEET is mandatory for Indian students joining foreign medical courses​."]} 
      title2={""} content2={[""]} imageAlt={"Ausbildung Image"} imageSrc={"/assets/Images/blogs/mbbs-in-russia-without-neet-1.webp"}/>
      
      {/*What does this mean to you Section i.e section with 2x2 grid with description  */}
      <section className='px-[6vw] md:px-[12.625vw] '>
        <h3 className='text-h5TextPhone md:text-h3Text font-bold pb-[5vw] md:pb-[3vw] leading-[120%]'>What does this mean for you?</h3>
        <div className='flex flex-col gap-[4vw] md:gap-[2vw]  '>
        <p className='leading-[150%] text-smallTextPhone md:text-regularText'>Enrolling in a Russian MBBS program without a NEET score is possible. Still, if you plan to return and practice in India, you’ll eventually need a NEET qualification (at least a NEET eligibility certificate) to sit for the licensing exams. Many students who haven’t secured a good NEET score choose to start their MBBS in Russia and plan to re-attempt NEET later during their studies​.</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-[4vw] md:gap-[2vw]'>
          <div className='flex flex-col  gap-[2vw] md:gap-[1vw]'>
            <h4 className='text-h4Text font-bold text-dimgrayChosen leading-[130%]'>English Proficiency:</h4>
            <p className='leading-[150%]  text-smallTextPhone md:text-regularText'>Most Russian universities teach MBBS in English, so formal language tests like IELTS/TOEFL are usually not required. You should have had English as a subject in high school (generally sufficient). Some universities may conduct a basic English test or interview, but it’s uncommon.</p>
          </div>
          <div className='flex flex-col  gap-[2vw] md:gap-[1vw]'>
            <h4 className='text-h4Text font-bold text-dimgrayChosen leading-[130%]'>Health and Other Requirements:</h4>
            <p className='leading-[150%] text-smallTextPhone md:text-regularText'>You must provide a medical fitness certificate (showing you don’t have any contagious diseases) at the time of admission​. Additionally, all academic certificates (10th and 12th marksheets) must be apostilled (officially attested by the Ministry of External Affairs in India) for use abroad​. This is a standard procedure for foreign admissions.</p>
          </div>
        </div>
        <p className='leading-[150%] text-smallTextPhone md:text-regularText'>If you haven’t cracked NEET, you can still pursue MBBS in Russia if you meet the age and academic requirements. But do remember that eventually, clearing NEET (at least the qualifying marks) is strongly recommended to ensure your degree is recognized back home​. Edurizon’s counselors can clarify any confusion around NEET eligibility and guide you through the regulations so you can make an informed decision.</p>
        </div>
      </section>

      {/* Benefits of Studying MBBS in Russia Sections i.e section with 3x3 grid*/}
      <section className='px-[6vw] md:px-[12.625vw] text-smallTextPhone md:text-regularText leading-[150%]'>
        <h3 className='md:pb-[1vw] pb-[4vw] text-h5TextPhone md:text-h3Text leading-[120%]'>Benefits of Studying MBBS in Russia</h3>
        <p className='mb-[3vw]  '>Choosing Russia for your medical studies comes with several advantages that make it one of the top destinations for MBBS abroad:</p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-[4vw] text-smallTextPhone md:text-regularText gap-y-[4vw] md:gap-x-[2vw] md:gap-y-[2vw]'>
            {benefitsToStudy.map((item,index)=>(
              <div key={index}>
              <h6 className='  md:mb-[.5vw]'>{item.title}</h6>
              <p className=' text-[rgba(0,0,0,.6)]'>{item.description}</p>
              </div>  
            ))}
            
        </div>
      </section>
      
      {/* Image */}
      <Image src="/assets/Images/blogs/mbbs-in-russia-without-neet-2.webp" alt="MBBS in Russia" width={1024} height={1024} className='w-full h-auto mx-auto' />
      {/*Challenges of Studyign MBBS in russia Sections i.e section with 2x2 grid */}
      <section className='px-[6vw] md:px-[12.625vw] text-smallTextPhone md:text-regularText leading-[150%]'>
        <h3 className='md:pb-[1vw] pb-[4vw] text-h5TextPhone md:text-h3Text leading-[120%]'>Challenges and Things to Consider <br/>Before Applying</h3>
        <p className='mb-[3vw] '>Studying MBBS in Russia without NEET is an attractive option, but you should also be aware of the challenges and important considerations to make an informed decision:</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-[4vw]  gap-y-[4vw] md:gap-x-[2vw] md:gap-y-[2vw] md:pb-[2vw] pb-[4vw]'>
            {challengesToStudy.map((item,index)=>(
              <div key={index}>
              <h6 className='  md:mb-[.5vw]'>{item.title}</h6>
              <p className=' text-[rgba(0,0,0,.6)]'>{item.description}</p>
              </div>  
            ))}
            
        </div>
        <p className=' '>In short, go into this journey with your eyes open. The challenges are real but not insurmountable. Thousands of Indian students have not only completed MBBS in Russia but thrived and become successful doctors. You can overcome these hurdles with the right mindset, support system, and guidance from experts like Edurizon. Being forewarned is being forearmed – knowing these challenges means you can prepare for them and ensure your focus remains on your ultimate goal.</p>
      </section>

   
      <AdmissionProcess subHeading='Your MBBS Journey to Russia Made Simple'/>
      
      {/* How Edurizon Helps Section 3x3 grid */}
      <EdurizonProcess country="Russia"/>

      {/* Conclusion */}
      <div className='px-[6vw] md:px-[12.625vw] '>
        <h2 className='text-h5TextPhone md:text-h2Text text-center text-orangeChosen leading-[120%] pb-[1vw]'>Unsure About Which College You’ll Get?</h2>
        <p className='text-smallTextPhone md:text-regularText md:px-[6.875vw] text-justify pb-[3vw] leading-[150%]'>
        Not sure which college you’ll get or want personalized advice? Check out our College Finder to Select the suitable college for you or fill out the eligibility 
        check form below, and our experts will get back to you with a free assessment and guidance.
        </p>
        <h2 className='pb-[3vw] text-h5TextPhone md:text-h2Text leading-[120%] text-center'><a href='https://college-predictor-nine.vercel.app/'>NEET COLLEGE PREDICTOR</a></h2>

        <h3 className='text-h5TextPhone md:text-h3Text font-bold text-orangeChosen italic pb-[4vw] md:pb-[1.5vw] leading-[120%]'>Conclusion</h3>
        <p className='text-smallTextPhone md:text-regularText italic leading-[150%]'>Pursuing an MBBS in Russia without NEET is a promising option for students determined to become doctors despite the hurdles. 
          With the right guidance and support, you can navigate the process smoothly and embark on an exciting medical education journey abroad. Russia offers world-class
           universities, an internationally recognized degree, and an affordable education – a combination that’s hard to beat.
        <br/>
        <br/>
        Just make sure to do your homework: understand the eligibility, prepare your documents, be mindful of future licensing requirements, and choose a reliable partner
         like Edurizon to walk beside you. Your dream of wearing that doctor’s coat is still alive and achievable – a NEET setback should not stop you from reaching 
         your goal. Leap, and who knows, a few years from now, you might be back in India saving lives or exploring opportunities worldwide as a globally trained 
         doctor! Start your journey today by checking your eligibility with Edurizon. Let us help you every step of the way to study MBBS in Russia without NEET
          and transform your dreams into reality. Good luck, future doctor!</p>
      </div>
      <div/>
    </div>
  )
}

export default StudyMbbs
