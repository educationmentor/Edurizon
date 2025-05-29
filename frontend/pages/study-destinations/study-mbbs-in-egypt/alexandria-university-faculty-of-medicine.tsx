import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcumbs';

const services = [
  {
    icon: "/assets/Images/Icons/feesIcon.svg",
    text: "Tuition Fees",
    label: "$8,000/Year",
  },
  {
    icon: "/assets/Images/Icons/ExperienceIcon.svg",
    text: "",
    label: "Recognition by WHO, NMC",
  },
  {
    icon: "/assets/Images/Icons/TieUpsIcon.svg",
    text: "City & Province",
    label: "Alexandria, Egypt",
  },
  {
    icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
    text: "World Rank",
    label: "999",
  },
];

const AlexandriaUniversityFacultyOfMedicine = () => {
  return (
    <>
      <Head>
        <title>Alexandria University Faculty of Medicine | Study MBBS in Egypt - Edurizon</title>
        <meta name="description" content="Looking to secure your future in medicine? Your journey begins with Alexandria University Faculty of Medicine, a prestigious institution known for its exceptional medical programs and global recognition." />
        <meta name="keywords" content="Alexandria University Faculty of Medicine, MBBS in Egypt, Medical Education Egypt, Study Medicine Alexandria" />
      </Head>

      <div className="relative">
        <div className="w-full">
          <Image
            src="/assets/Images/mbbs-in-egypt/alexandria-university-banner.webp"
            alt="Alexandria University Faculty of Medicine"
            width={1920}
            height={1080}
            className="w-full"
          />
        </div>
        <Breadcrumbs />
      </div>

      <div className="mx-[6vw] md:mx-[12.5vw] mt-[10vw] md:mt-[4vw] grid grid-cols-1 md:grid-cols-4 gap-[2vw] md:gap-[1vw]">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-[2vw] md:gap-[1vw] bg-white p-[4vw] md:p-[1vw] rounded-lg shadow-lg"
          >
            <Image
              src={service.icon}
              alt={service.text}
              width={40}
              height={40}
              className="w-[8vw] md:w-[2vw] h-[8vw] md:h-[2vw]"
            />
            <div>
              <p className="text-smallTextPhone md:text-regularText text-dimgrayChosen">
                {service.text}
              </p>
              <p className="text-regularTextPhone md:text-mediumText font-bold">
                {service.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* About University Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text md:text-center text-left mb-[4vw] md:mb-[1vw]">About Alexandria University Faculty of Medicine</h3>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>Farouk University, now known as Alexandria University in Egypt, was founded in 1938. Later, it adopted the name Alexandria University.</li>
          <li>The second-largest institution in Egypt is Alexandria University. There are approximately 21 faculties and three institutes at the Alexandria University School of Medicine.</li>
          <li>The medical school of Alexandria University was established in 1942.</li>
          <li>The goal of Alexandria University College of Medicine is to provide the community with medical professionals who are skilled in identifying and treating public health problems using scientific data from medical specialties as well as ethical considerations.</li>
          <li>Moreover, the Alexandria University College of Medicine strives to provide excellent patient care and to support research with great vision and devotion.</li>
        </ul>
      </section>

      {/* About City Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text text-left mb-[4vw] md:mb-[1vw]">About Alexandria City, Egypt</h3>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>Alexandria, one of Egypt's largest cities, serves as both a major industrial hub and the country's main harbour.</li>
          <li>Around 114 miles (183 km) northwest of Cairo in Lower Egypt, the city is situated on the Mediterranean Sea at the western side of the Nile River delta.</li>
          <li>City's area is 116 square miles (300 square km)</li>
        </ul>
      </section>

      {/* Why Study Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text text-left mb-[4vw] md:mb-[1vw]">Why Study MBBS at Alexandria University Faculty of Medicine</h3>
        <p className="text-smallTextPhone md:text-regularText text-justify mb-[4vw] md:mb-[1vw]">
          This programme is offered to students who have the potential to shape a more sustainable and inclusive world. We focus our efforts on the schools where future leaders are educated and have a rigorous recruitment process before admitting students to our program.
        </p>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>One of the best universities in the world and in Egypt is Alexandria University.</li>
          <li>In the QS Global World Ranking, Alexandria University is ranked 1001+ and fourth in Egypt.</li>
          <li>Alexandria University has various areas of specialisation, particularly its college of medicine.</li>
          <li>In comparison to other universities, Alexandria University's tuition is likewise quite inexpensive.</li>
          <li>One of the more seasoned universities, particularly in the field of medicine, is Alexandria University.</li>
          <li>Alexandria University is dedicated to educating students for the difficulties of a profession that is changing quickly.</li>
          <li>The usage of cutting-edge technology at Alexandria University enables students to excel in this cutthroat environment.</li>
          <li>The interactive teaching approach used at Alexandria University will benefit the students' learning.</li>
          <li>Compared to other universities, Alexandria University offers more alluring and desirable work opportunities.</li>
        </ul>
      </section>

      {/* At a glance Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Alexandria University Faculty of Medicine at a glance</h3>
        <ul className="text-smallTextPhone ml-[3vw] md:ml-[1.5vw] text-left gap-x-[1vw] md:text-regularText md:text-justify grid grid-cols-2">
          <li className='font-bold'>o College name</li>
          <li>Alexandria University Faculty of Medicine</li>
          <li className='font-bold'>o Medium of Teaching</li>
          <li>English</li>
          <li className='font-bold'>o Currency</li>
          <li>Pounds</li>
          <li className='font-bold'>o Capital of Egypt</li>
          <li>Cairo</li>
          <li className='font-bold'>o Duration</li>
          <li>5+1 & 5+2 (optional)</li>
          <li className='font-bold'>o World Rank</li>
          <li>999</li>
          <li className='font-bold'>o City</li>
          <li>Alexandria, Egypt</li>
          <li className='font-bold'>o Follows NMC Gazette</li>
          <li>Yes</li>
        </ul>
      </section>

      {/* Recognition Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Affiliation and Recognition</h3>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>World Health Organisation (WHO)</li>
          <li>Medical Council of India (MCI)</li>
          <li>Minister of Higher Education, Egypt</li>
        </ul>
      </section>

      {/* Eligibility Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Eligibility Criteria</h3>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>A student must be at least 17 but not more than 25 years old.</li>
          <li>The student needs to pass the NEET exam.</li>
          <li>No criminal convictions on academic record.</li>
          <li>Minimum 60% in 12th standard.</li>
          <li>Must possess equivalent credential to the Egyptian High School Diploma.</li>
        </ul>
      </section>

      {/* Documents Required Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Documents Required</h3>
        <ul className="text-smallTextPhone list-disc ml-[3vw] md:ml-[1.5vw] text-left md:text-regularText md:text-justify">
          <li>Secondary & Higher Secondary Certificates</li>
          <li>8 passport size photographs</li>
          <li>Original passport</li>
          <li>NEET scorecard</li>
          <li>Birth certificate (original or copy)</li>
          <li>Acceptance letter from Alexandria University</li>
          <li>AIDS/HIV test attested by Ministry of Foreign Affairs</li>
          <li>Medical certificate</li>
        </ul>
      </section>

      {/* Fee Structure Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">Fee Structure for 2022-23 session</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-smallTextPhone md:text-regularText border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Particular</th>
                <th className="border border-gray-300 p-2">1st Year</th>
                <th className="border border-gray-300 p-2">2nd Year</th>
                <th className="border border-gray-300 p-2">3rd Year</th>
                <th className="border border-gray-300 p-2">4th Year</th>
                <th className="border border-gray-300 p-2">5th Year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Tuition Fee (USD)</td>
                <td className="border border-gray-300 p-2">7,500</td>
                <td className="border border-gray-300 p-2">6,000</td>
                <td className="border border-gray-300 p-2">6,000</td>
                <td className="border border-gray-300 p-2">6,000</td>
                <td className="border border-gray-300 p-2">6,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Tuition Fee (INR)</td>
                <td className="border border-gray-300 p-2">5,25,000</td>
                <td className="border border-gray-300 p-2">4,20,000</td>
                <td className="border border-gray-300 p-2">4,20,000</td>
                <td className="border border-gray-300 p-2">4,20,000</td>
                <td className="border border-gray-300 p-2">4,20,000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Hostel Fee (USD)</td>
                <td className="border border-gray-300 p-2">100 - 200</td>
                <td className="border border-gray-300 p-2">100 - 200</td>
                <td className="border border-gray-300 p-2">100 - 200</td>
                <td className="border border-gray-300 p-2">100 - 200</td>
                <td className="border border-gray-300 p-2">100 - 200</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Total Fee (INR)</td>
                <td className="border border-gray-300 p-2">5,32,000 - 5,39,000</td>
                <td className="border border-gray-300 p-2">4,27,000 - 4,34,000</td>
                <td className="border border-gray-300 p-2">4,27,000 - 4,34,000</td>
                <td className="border border-gray-300 p-2">4,27,000 - 4,34,000</td>
                <td className="border border-gray-300 p-2">4,27,000 - 4,34,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Syllabus Section */}
      <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw]">
        <h3 className="text-h6TextPhone leading-[120%] md:text-h5Text text-left">MBBS Syllabus</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-smallTextPhone md:text-regularText border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Year</th>
                <th className="border border-gray-300 p-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1st Year</td>
                <td className="border border-gray-300 p-2">Basic Mechanisms Of Diseases, Immunology And Molecular Medicine, Cardiovascular System, Genetics, Haematology System, Respiratory System</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">2nd Year</td>
                <td className="border border-gray-300 p-2">Epidemiology And Biostatistics, Gastro-Intestinal System And Nutrition, Musculoskeletal System, Nervous System, Urinary System, Reproductive System, Endocrine And Metabolism</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">3rd Year</td>
                <td className="border border-gray-300 p-2">Medicine Posting, Obstetrics & Gynaecology Posting, Surgery Posting, Paediatrics Posting, Primary Care Medicine Posting, Dermatology Posting, Community Health Posting</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">4th Year</td>
                <td className="border border-gray-300 p-2">Medicine Posting, Obstetrics And Gynaecology Posting, Surgery Posting, Paediatrics Posting, Orthopaedics Posting, Psychiatry Posting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AlexandriaUniversityFacultyOfMedicine; 