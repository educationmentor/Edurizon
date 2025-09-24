import UnlistedTable from '@/components/studyDestinationComponents/unListedTable'
import UnlistedTableEqualWidth from '@/components/studyDestinationComponents/unListedTableEqualWidth'
import React from 'react'
import Breadcrumbs from "@/components/Breadcumbs";
import Image from 'next/image';

const scamsAndAwarenessData = {
  title: 'Scams & Admission Fraud Awareness',
  subTitle: '',
  data: [
    ['Scams', 'Checks'],
    ['No “guaranteed visa” claims', ' avoid anyone promising approvals.'],
    ['Never pay large sums to personal accounts', 'use official university portals.'],
    ['Verify I-20 & SEVIS steps', 'cross-check school codes and payment portals.'],
    ['Beware fake offers/“too good to be true” tuition', 'confirm via official sites.'],
    ['Use documented service agreements with consultants', 'read refund policies.'],
  ]
}

const climateData = {
  title: 'Climate & Academic Breaks ',
  subTitle: '',
  data: [
    ['Breaks', 'Checks'],
    ['Winter Break', '~2–4 weeks (Dec–Jan)'],
    ['Spring Break', '~1 week (Mar)'],
    ['Summer Break', '~10–14 weeks (May–Aug) — prime for internships/RAships'],

  ]
}

const scholarshipData = {
  title: 'Scholarships & Funding',
  subTitle: '',
  data: [
    ['University Scholarships (merit/need)', 'Tuition discounts, entrance awards, departmental grants.'],
    ['Winter Break', '~Common in STEM/business analytics—tuition waivers + stipend.'],
    ['External Scholarships', 'Fulbright, Tata, Inlaks, JN Tata Endowment, state schemes.'],
    ['On-campus Roles', 'Research hourly roles, grading, labs, libraries (F-1 compliant).'],

  ]
}

const visaData = {
  title: 'Visa Types & Requirements',
  subTitle: '',
  data: [
    [],
    ['F-1 (Academic)', 'Full-time programs, on-campus work allowed (hour-limits); OPT/CPT available.'],
    ['J-1 (Exchange)', 'Sponsored exchanges; some are subject to two-year home residency rules.'],
    ['M-1 (Vocational)', 'Skill programs; different work rules from F-1.'],
  ]
}

const topUniversitiesData = {
  title: 'Top Universities in USA (Representative)',
  subTitle: '',
  data: [
    ["University","Location","Indicative Annual Tuition (USD)","Typical Global Band","Popular Programs"],
    ['MIT', 'Cambridge, MA','₹55k–65k','Top 1–5','Engineering, CS, Econ'],
    ['Stanford', 'Stanford, CA','₹55k–70k','Top 2–6','CS, Engg, Business'],
    ['Harvard', 'Cambridge, MA','₹55k–70k','Top 1–5','Business, Law, Medicine'],
    ['Caltech', 'Pasadena, CA','₹55k–65k','Top 5–10','Physics, Engg'],
    ['UC Berkeley', 'Berkeley, CA','₹40k–60k','Top 10–25','CS, Engg, Business'],
    ['Princeton', 'Princeton, NJ','₹55k–70k','Top 5–10','Humanities, Engg'],
    ['Yale', 'New Haven, CT','₹55k–70k','Top 5–15','Law, Arts, Social Sci'],
    ['Columbia', 'New York, NY','₹55k–75k','Top 5–15','Business, Journalism, Engg'],
    ['Univ. of Chicago', 'Chicago, IL','₹55k–70k','Top 10–20','Econ, Business, CS'],
    ['Univ. of Pennsylvania', 'Philadelphia, PA','₹55k–70k','Top 5–15','Wharton, Engg'],
  ]
}

const populatCourseData = {
  title: 'Popular Courses & Pathways',
  subTitle: '',
  data: [
    [],
    ['STEM (CS, Data, AI/ML, EE, Mech, Bio-engineering)', 'High employer demand + 24-month STEM OPT extension make these top choices for Indian students.'],
    ['Business & Analytics (BBA, MBA, MSBA, Finance, Marketing)', 'Look for programs with experiential learning, case competitions, and corporate projects.'],
    ['Health & Public Health (Pre-med, Nursing, MPH, Allied Health)', 'U.S. MD is a post-baccalaureate path (MCAT + med school). Many international students choose MPH, Nursing, or allied health for direct career routes.'],
    ['Design, HCI, Communications, Social Sciences', 'Portfolios and capstones matter; internships in UX, content, policy, and media are robust in major metro hubs.'],
    ['Vocational/Certificate (M-1) & Specialized Diplomas', 'Skills-focused and shorter, but different work rules than F-1. Check objectives carefully.'],
  ]
} 

const costData={
  title: 'Cost of Studying — Tuition & Living',
  subTitle: 'Typical Annual Totals (USD; INR shown for planning only)',
  data: [
    ["Expense","Annual Cost (INR)"],
    ['Public Universities', '$25k–$45k tuition; living $12k–$20k → Total: $37k–$65k'],
    ['Private Universities', '$45k–$75k+ tuition; living $15k–$25k → Total: $60k–$100k+'],
  ]
}

const livingSnapshotData = {
  title: '',
  subTitle: 'City-wise Living Snapshot',
  data: [
    [],
    ["High Cost"," New York, San Francisco, Boston, Seattle — rent & transport premium"],
    ["Moderate","Austin, Chicago, LA suburbs, San Diego — variable by neighborhood"],
    ["Low Cost","College towns (Madison, Ann Arbor, West Lafayette, Ames) — student-friendly markets"]
  ]
}

const whyStudyInUSAData = [
  {title:"Affordable pathways across tiers",description:"The U.S. has options from flagship publics to elite privates and cost-effective regional campuses—so you can match academics, budget, and career outcomes.Elaboration: Smart shortlisting (mix of public + private + scholarships) often brings overall cost close to premium options in other countries, while still accessing the U.S. job market."},
  {title:"Deep industry linkages & internships",description:"Proximity to tech, finance, consulting, healthcare, and media hubs enables real projects.Elaboration: Co-ops/CPT and career centers help you convert internships into full-time roles."},
  {title:"Flexible, interdisciplinary curricula",description:"Choose majors/minors, change tracks, or combine CS with Design, Economics with Data Science.Elaboration: Flexibility reduces the “wrong course” risk and lets you tailor skills to employer needs."},
  {title:"Research & innovation culture",description:"Access to cutting-edge labs, maker spaces, and funded projects.Elaboration: Undergrads and master’s students can join research groups early, boosting profiles for jobs or PhD pathways."},
  {title:"Global recognition & alumni networks",description:"U.S. degrees are prized worldwide and alumni communities are massive.Elaboration: Strong networks amplify referrals, mentorship, and geographic mobility."},
  {title:"Post-study work (OPT + STEM OPT)",description:"Cities like Kazan and Moscow host thriving Indian student communities, celebrating festivals like Diwali and ......."},
]

const sampleFeesData ={
  title: 'Sample Fee Table — Public & Private Mix (USD & Approx INR)',
  subTitle: '',
  data: [
    ["University","Tuition (USD)","Tuition (Approx INR)","Living (USD)","Living (Approx INR)"],
    ['Arizona State Univ', '32,000', '₹27.2L', '16,000', '₹13.6L'],
    ['Univ of Illinois Urbana-Champaign', '38,000', '₹32.3L', '18,000', '₹15.3L'],
    ['Purdue Univ', '32,000', '₹27.2L', '16,000', '₹13.6L'],
    ['Univ of Texas at Dallas', '35,000', '₹29.8L', '16,000', '₹13.6L'],
    ['North Carolina State Univ', '32,000', '₹27.2L', '16,000', '₹13.6L'],
    ['Northeastern Univ', '56,000', '₹47.6L', '22,000', '₹18.7L'],
    ['Boston Univ', '62,000', '₹52.7L', '22,000', '₹18.7L'],
    ['Univ of Southern California', '64,000', '₹54.5L', '24,000', '₹20.4L'],
    ['Univ of Florida', '30,000', '₹25.5L', '15,000', '₹12.7L'],
    ['Univ of Cincinnati', '29,000', '₹24.7L', '14,000', '₹11.9L'],
  ]
}

const eligibilityData = {
  title: 'Eligibility Criteria',
  subTitle: '',
  data: [
    ["Criteria","Details"],
    ["Academics (UG)","Class 12 with solid GPA; competitive boards/subjects help."],
    ["Academics (PG)","Recognized bachelor’s; minimum GPA as per program (often 3.0/4.0 equivalent)."],
    ["English Proficiency","TOEFL/IELTS/Duolingo (waivers possible if medium of instruction/criteria met)."],
    ["Standardized Tests","SAT/ACT (UG) — many test-optional; GRE/GMAT (PG) — program-dependent."],
    ["Experience/Portfolio","MBA/design/HCI/arts often require work samples or relevant experience."],
    ["Age","17+ for UG; PG as per degree norms."],
  ]
}



const USA = () => {
  return (
    <div className=''>
       {/* Breadcumb section and about nepal */}
       <div className="mx-[6vw] md:w-[73.125vw] flex flex-col gap-[5vw] mb-[1vw] py-[4vw] items-center md:mx-auto">
                <div className="flex flex-col items-center gap-[2vw] md:gap-[2vw]">
                <div className="flex flex-col items-center gap-[4vw] md:gap-[1vw]">
                    <Breadcrumbs/>
                    <h1 className="text-h4TextPhone text-center   font-bold leading-[120%] md:text-h1Text">Study in USA -<br/>
                    Best Universities, Costs, Admissions & Career Pathways</h1>
                </div>
                </div>
            </div>
        
        {/* Description Part */}
        <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] flex flex-col md:flex-row gap-[2vw] md:gap-[5vw] justify-center '>
          <div className='flex flex-col gap-[2vw] md:gap-[2vw] text-regularTextPhone md:text-regularText leading-[150%] text-justify w-full md:w-[40vw]'>
          <p className=''>
            The United States is the world’s most sought-after study destination—home to elite research universities, flexible curricula, and powerful industry linkages. This guide brings everything together for Indian students: admissions, eligibility, fees (USD + INR), scholarships, visas, OPT/CPT work routes, city-wise living, and post-study careers.
            From Ivy League campuses (Harvard, Princeton, Yale) to tech powerhouses (MIT, Stanford, UC Berkeley), the U.S. ecosystem blends world-class academics with internships, accelerators, and alumni networks that open doors globally.
            </p>
            <p className='font-bold'>
            At Edurizon, we handhold you end-to-end—shortlisting, tests, essays, documentation, Form I-20/SEVIS, visa interview prep, pre-departure, and landing support.
            </p>
          </div>
      
        <Image src="/assets/Images/study-in-usa/usa1.webp" alt="USA" className='w-full md:w-[19vw] h-auto flex-shrink-0' width={500} height={500} />
        </div>

        {/* Why Study in USA Section */}
        <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] flex flex-col gap-[2vw] md:gap-[2vw] '>
          <h4 className='text-h4TextPhone md:text-h3Text leading-[120%] font-bold'>Why Study in <span className='text-orangeChosen'>USA?</span></h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-[2vw] md:gap-x-[1vw] md:gap-y-[2vw] '>
            {whyStudyInUSAData.map((data, index) => (
              <div key={index} className='flex flex-col gap-[.5vw] md:gap-[.5vw]'>
                <p className='text-regularTextPhone md:text-mediumText leading-[120%] font-bold'>{data.title}</p>
                <p className='text-smallTextPhone md:text-regularText leading-[150%]  text-[rgba(0,0,0,0.6)]'>{data.description}</p>
              </div>
            ))}
          </div>
        </div>

       {/* Top Universities table */}
       <div className=''>
      <UnlistedTableEqualWidth id='top-universities' section2='highlight' content={topUniversitiesData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      Use official pages for exact fees by program. Many public universities have lower tuition than elite privates but strong ROI, especially in engineering/computing.</p>
      </div>

      {/* Popular Courses & Pathways table */}
      <div className=''>
      <UnlistedTableEqualWidth id='popular-courses-and-pathways' section2='highlight' content={populatCourseData}/>
      </div>

      {/* Cost of Studying table */}
      <div className=''>
      <UnlistedTableEqualWidth id='cost-of-studying' section2='highlight' content={costData}/>
      <UnlistedTableEqualWidth id='living-snapshot' section2='' content={livingSnapshotData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      Always cross-check university “Cost of Attendance.” For INR display onsite, apply a live FX rate and a 5–8% buffer for inflation.</p>
      </div>

      {/* Sample Fees table */}
      <div className=''>
      <UnlistedTableEqualWidth id='sample-fees' section2='highlight' content={sampleFeesData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      Figures vary by program (e.g., CS/Engineering often higher). Add health insurance (often $1.2k–$3k/year) + fees.</p>
      </div>

      {/* Eligibility Criteria table */}
      <div className=''>
      <UnlistedTableEqualWidth id='eligibility-criteria' section2='highlight' content={eligibilityData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      For scholarships/assistantships, exceed minimums: strong SOP, specific LORs, and proofs of projects/impact.</p>
      </div>

            
      {/* Visa table */}
      <UnlistedTableEqualWidth id='visa' section2='highlight' content={visaData}/>

      {/* Core Documents Section */}
      <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] text-regularTextPhone md:text-mediumText flex flex-col md:flex-row gap-[2vw] md:gap-[4vw] '>
        <h4 className='text-h4TextPhone md:text-h3Text leading-[120%] font-bold flex-shrink-0'>Core Documents</h4>
        <div className='text-regularTextPhone md:text-mediumText leading-[150%] font-bold '>
          <span>
            Passport • Form I-20/DS-2019 • SEVIS fee receipt • Admission letter • Financial proofs (bank/loan) • Transcripts/test scores • Visa appointment & DS-160 confirmations.
          </span>
          <br/>
          <br/>
          <span className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
           Funds should typically cover one academic year of expenses (tuition + living). Maintain consistency across statements, affidavits, and sponsor details.</span>
        </div>
      </div>

      {/* Scholarship table */}
      <div className=''>
      <UnlistedTableEqualWidth id='scholarship' section2='highlight' content={scholarshipData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      Apply early; align SOPs to faculty/projects; quantify impact (publications, GitHub, competitions, internships).</p>
      </div>

    

      {/* Career And Work Section */}
      <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] text-regularTextPhone md:text-mediumText flex flex-col gap-[2vw] md:gap-[2vw] '>
        <h4 className='text-h4TextPhone md:text-h4Text leading-[120%] font-bold'>Career & Work Options — OPT, STEM OPT, CPT, H-1B</h4>
        <ul className='list-inside leading-[150%] list-disc md:ml-[1vw]'>
            <li>
              <strong>OPT:</strong> Up to 12 months in-field work after (or during) studies.
            </li>
            <li>
              <strong>STEM OPT Extension:</strong> Additional 24 months for designated STEM degrees.
            </li>
            <li>
              <strong>CPT:</strong> Paid internships tied to curriculum (DSO authorization).
            </li>
            <li>
              <strong>H-1B:</strong> Employer-sponsored skilled visa; cap-subject, lottery-based, alternatives exist (cap-exempt/non-profit).
            </li>
        </ul>
        <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold'><span className='text-black'>Elaboration: </span>
         Build a portfolio from semester 1—projects, hackathons, faculty labs, and networking via clubs and LinkedIn.</p>
      </div>

      {/* Student Life Support Section */}
      <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] text-regularTextPhone md:text-mediumText flex flex-col gap-[2vw] md:gap-[2vw] '>
        <h4 className='text-h4TextPhone md:text-h4Text leading-[120%] font-bold'>Student Life & Support</h4>
        <ul className='list-inside leading-[150%] list-disc md:ml-[1vw]'>
            <li>
              <strong>Housing:</strong> On-campus (convenience, safety) vs off-campus (cost control, independence).
            </li>
            <li>
              <strong>Healthcare/Insurance:</strong> Mandatory; understand deductibles, in-network providers.
            </li>
            <li>
              <strong>Safety:</strong> Campus police, blue-light phones, escort services, alerts.
            </li>
            <li>
              <strong>Community:</strong> Indian associations (Diwali/Holi), cultural centers, mentorship.
            </li>
            <li>
              <strong>Travel:</strong> Campus shuttles, transit passes, biking; car ownership varies by city.
            </li>
        </ul>
        <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold'><span className='text-black'>Elaboration: </span>
         Choose neighborhoods by commute and safety reports; sign leases after reading utilities/internet clauses.</p>
      </div>

      {/* Climate table */}
      <div className=''>
      <UnlistedTableEqualWidth id='climate' section2='highlight' content={climateData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '><span className='text-black'>Elaboration: </span>
      Cold-weather campuses have robust heating; plan clothing intelligently and buy locally for better prices.</p>
      </div>



      {/* Post Arrival Section */}
      <div className='mx-[6vw] md:mx-[12.5vw] my-[4vw] md:my-[4vw] '>
          <h3 className='text-h4TextPhone md:text-h3Text font-bold leading-[120%] mb-[2vw]'>Post Arrival Support</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 mb-[2vw] justify-between text-regularTextPhone md:text-regularText font-bold leading-[150%] gap-y-[1vw] list-inside'>
            <li>Airport Pick Up</li>
            <li>University Registration</li>
            <li>Academic & Administrative Support</li>
            <li>Daily Life & Cultural Integration</li>
            <li>Long Term Support</li>
            <li>Academic Mentoring</li>
            <li>Emergency Assistance</li>
          </div>
          <p className='text-smallTextPhone md:text-regularText leading-[150%] text-[rgba(0,0,0,0.6)] text-center font-bold'>Early onboarding helps you secure part-time roles and research positions faster.</p>
      </div>


      {/* Scams and Awarness table */}
      <div className=''>
      <UnlistedTableEqualWidth id='scams-and-awareness' section2='highlight' content={scamsAndAwarenessData}/>
      <p className='text-regularTextPhone md:text-mediumText leading-[150%] text-[rgba(0,0,0,0.6)] font-bold mx-[6vw] md:mx-[12.5vw]'><span className='text-black'>Elaboration:</span> Maintain a paper trail (email receipts, payment IDs). Mismatch in financial documents is a common interview red flag.</p>
      </div>

      {/* Free Usa Guidence Section */}
      <section className='mx-[6vw] my-[4vw] md:my-[4vw] flex flex-col gap-[2vw] md:mx-[12.5vw]'>
        <div className='flex flex-col md:gap-[1.5vw]'>
          <h3 className='text-h4TextPhone md:text-h3Text font-bold leading-[120%]'>Free USA Guidance & Support</h3>
          <p className='text-smallTextPhone md:text-regularText leading-[150%] font-bold'>From the moment you sign up, Edurizon covers counselling, shortlisting, test planning, SOP/LOR editing, documentation, visa prep, and pre-departure. Over a period of time, we have sent hundreds of students to the USA; many have secured OPT roles and converted to full-time offers.</p>
        </div>
        <div className='flex flex-col md:flex-row md:gap-[1.5vw] items-center'>
          <h3 className='text-h4TextPhone md:text-h3Text font-bold leading-[120%] text-orangeChosen'>Get in Touch with Edurizon Today!</h3>
          <p className='text-smallTextPhone md:text-regularText leading-[150%] font-bold'>
          <span className='text-[rgba(0,0,0,0.6)]'>Kickstart your U.S. education journey. Contact Edurizon for expert admissions and visa assistance.</span><br/>
          Your dream university is one application away — let’s make it happen together!
          </p>
        </div>


      </section> 
      
    </div>
  )
}

export default USA
