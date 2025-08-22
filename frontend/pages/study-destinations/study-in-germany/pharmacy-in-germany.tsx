import Breadcrumbs from '@/components/Breadcumbs'
import React from 'react'
import Image from 'next/image'

const PharmacyInGermany = () => {
  return (
    <div className='flex flex-col mx-[6vw] md:mx-[12.5vw] items-center pt-[5vw] md:pt-[4vw] md:pb-[3vw] gap-[4vw] md:gap-[4vw] '>
      <div className='flex flex-col gap-[1vw] w-full items-center'>
        <Breadcrumbs />
        <div>
          <h1 className="text-h4TextPhone md:text-h1Text font-bold text-center text-orangeChosen leading-[120%] pb-[4vw]">Study Pharmacy in Germany</h1>
          <h5 className='text-h5TextPhone md:text-h5Text font-bold text-center leading-[130%]'>STUDY & SETTLE IN GERMANY | 100% PLACEMENT | EXCELLENT CAREER OPPORTUNITIES</h5>
        </div>
      </div>

      {/* Overview Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Overview</h3>
        <p className='text-regularTextPhone md:text-regularText leading-[130%]'>Germany is home to global pharmaceutical giants such as Bayer and Boehringer Ingelheim, making it a hub for pharma research and production. Beyond the industry, pharmacists in local pharmacies enjoy a well-respected profession.</p>
        <p className='text-regularTextPhone md:text-regularText leading-[130%]'>With this recognition, Germany offers international students strong opportunities to study and build careers in pharmacy.</p>
        <p className='text-regularTextPhone md:text-regularText leading-[130%]'>Currently, there are 12 universities offering 12 English-taught degree programs in Pharmacy, covering diverse specialisations from pharmaceutical marketing to industrial pharmacy, biotechnology, chemistry, and medicine.</p>
      </div>

      {/* Quick Facts Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Quick Facts</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>12 Study Programs in English</li>
          <li>8 Universities in International Rankings</li>
        </ul>
        
        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Tuition Fees:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Minimum: €0 (7 programs for EU citizens, 6 for non-EU citizens)</li>
          <li>Maximum: €35,000 per semester</li>
        </ul>

        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Application Deadlines:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Winter Semester: Between August 31 – July 15</li>
          <li>Summer Semester: Between May 31 – July 15</li>
        </ul>
      </div>

      {/* Featured Universities Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Featured Universities</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-orangeChosen text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">University</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Students</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Program Fees</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Rankings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Freie Universität Berlin</td>
                <td className="border border-gray-300 px-4 py-2">Public University</td>
                <td className="border border-gray-300 px-4 py-2">38,000+</td>
                <td className="border border-gray-300 px-4 py-2">€0 (per semester)</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-4">
                    <li>#83 Times Higher Education</li>
                    <li>#127 QS World University Rankings</li>
                    <li>#84 ARWU</li>
                  </ul>
                </td>
              </tr>
              <tr className="bg-gray-50 text-black">
                <td className="border border-gray-300 px-4 py-2 font-semibold">University of Bonn</td>
                <td className="border border-gray-300 px-4 py-2">Public University</td>
                <td className="border border-gray-300 px-4 py-2">35,000+</td>
                <td className="border border-gray-300 px-4 py-2">€0 (per semester)</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ul className="list-disc pl-4">
                    <li>#112 Times Higher Education</li>
                    <li>#226 QS World University Rankings</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tuition Fee Ranges Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Tuition Fee Ranges</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Free (EU citizens)</li>
          <li>Free (Non-EU citizens)</li>
          <li>Up to €1,500 / semester</li>
          <li>Up to €3,000 / semester</li>
          <li>Up to €5,000 / semester</li>
          <li>More than €5,000 / semester</li>
        </ul>
      </div>

      {/* English-Taught Pharmacy Programs Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>English-Taught Pharmacy Programs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-orangeChosen text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">University</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Program</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Degree</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tuition (per semester)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Admission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Hochschule Fresenius (Idstein)</td>
                <td className="border border-gray-300 px-4 py-2">Bioanalytical Chemistry and Pharmaceutical Analysis (Part-Time)</td>
                <td className="border border-gray-300 px-4 py-2">Master of Science</td>
                <td className="border border-gray-300 px-4 py-2">1.5 Years</td>
                <td className="border border-gray-300 px-4 py-2">€3,120 – €3,420</td>
                <td className="border border-gray-300 px-4 py-2">Open all year</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Hochschule Fresenius (Idstein)</td>
                <td className="border border-gray-300 px-4 py-2">Bioanalytical Chemistry and Pharmaceutical Analysis (Full-Time)</td>
                <td className="border border-gray-300 px-4 py-2">Master of Science</td>
                <td className="border border-gray-300 px-4 py-2">1 Year</td>
                <td className="border border-gray-300 px-4 py-2">€4,500 – €4,800</td>
                <td className="border border-gray-300 px-4 py-2">Open all year</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Hochschule Fresenius (Wiesbaden)</td>
                <td className="border border-gray-300 px-4 py-2">International Health Economics & Pharmacoeconomics</td>
                <td className="border border-gray-300 px-4 py-2">Master of Science</td>
                <td className="border border-gray-300 px-4 py-2">2 Years</td>
                <td className="border border-gray-300 px-4 py-2">€4,770 – €5,070</td>
                <td className="border border-gray-300 px-4 py-2">Open all year</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left mt-4'>Highlights:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Top-class academic education since 1848</li>
          <li>Complete Master's in only one year</li>
          <li>Hands-on labs with cutting-edge technology</li>
        </ul>
      </div>

      {/* Application & Admission Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Application & Admission</h3>
        
        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Deadlines:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Winter Semester 2022/23: 4 programs</li>
          <li>Summer Semester 2023: 5 programs</li>
          <li>Winter Semester 2023/24: 11 programs</li>
        </ul>

        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Requirements:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Bachelor's in a related field (Pharmaceutical Medicine, Chemistry, Biology, etc.)</li>
          <li>CV and Motivation Letter</li>
          <li>Proof of English: B2 level (IELTS/TOEFL/Cambridge)</li>
        </ul>

        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Language Proficiency:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>IELTS: 5.0 – 6.5</li>
          <li>TOEFL: 80 – 94</li>
          <li>Cambridge: B2 (FCE) – C2 (CPE)</li>
        </ul>

        <h4 className='text-h4TextPhone md:text-h4Text font-bold leading-[130%] text-left'>Application Modes:</h4>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>58.3% Direct at University</li>
          <li>25% via Uni-assist</li>
        </ul>
      </div>

      {/* Universities Offering English-Taught Programs Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Universities Offering English-Taught Pharmacy Programs</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Freie Universität Berlin – Public, 38,000 students, Free tuition</li>
          <li>Goethe University Frankfurt – Public, 42,000 students, Fees up to €35,000</li>
          <li>Hamburg University of Applied Sciences – Public, 17,000 students, Free tuition</li>
          <li>Heinrich Heine University Düsseldorf – Public, 33,000 students, Free tuition</li>
        </ul>
      </div>

      {/* Why Choose Germany Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Why Choose Germany for Pharmacy Studies?</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Globally recognised pharmaceutical industry leaders</li>
          <li>Free or affordable tuition at many universities</li>
          <li>Specialisations in marketing, biotechnology, industrial and clinical pharmacy</li>
          <li>High employability with 100% placement pathways</li>
          <li>Opportunities to settle in Germany post-study</li>
        </ul>
      </div>

      {/* Services Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>We provide the following facilities<br/>
        in India as well as in Germany</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Invitation letter</li>
          <li>Accommodation assistance</li>
          <li>City registration</li>
          <li>Visa renewal</li>
          <li>DTH service</li>
          <li>Bank assistance (Block account)</li>
          <li>Pre & Post-departure training</li>
          <li>Local support</li>
          <li>Insurance assistance</li>
          <li>Admission documentation</li>
          <li>VFS application</li>
          <li>Statement of purpose preparation</li>
          <li>Letter of recommendation preparation</li>
          <li>Affidavit preparation</li>
          <li>Air pick up in Germany</li>
          <li>Visa documentation</li>
        </ul>

        <p className='text-regularTextPhone md:text-regularText leading-[130%]'>We have our agency and person in Germany who are ready to assist you on 27 x 7 basis as local support</p>
      </div>

      {/* Interesting Facts Section */}
      <div className='flex flex-col gap-[1vw] w-full'>
        <h3 className='text-h3TextPhone md:text-h3Text font-bold leading-[130%] text-left underline'>Interesting facts about Germany</h3>
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] font-medium list-outside md:text-regularText text-regularTextPhone'>
          <li>Public Universities charge zero tuition fees</li>
          <li>18 months stay back facilities</li>
          <li>Schengen Visa</li>
          <li>Part time job permission</li>
          <li>4th largest economy in the world</li>
          <li>Easiest way to get PR</li>
          <li>Paid internship</li>
          <li>Huge job opportunities</li>
          <li>World class standard of education</li>
          <li>Home to global pharmaceutical giants like Bayer and Boehringer Ingelheim</li>
          <li>Strong pharmaceutical research and production industry</li>
          <li>Well-respected pharmacy profession</li>
        </ul>
      </div>
    </div>
  )
}

export default PharmacyInGermany
