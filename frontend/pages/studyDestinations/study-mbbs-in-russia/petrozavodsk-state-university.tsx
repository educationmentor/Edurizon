import Breadcrumbs from "@/components/Breadcumbs";
import Image from "next/image";
const services = [
    {
      icon: "/assets/Images/Icons/feesIcon.svg",
      text: "Tution Fees",
      label: "Ruble 2,85,000 / Year",
    },
    {
      icon: "/assets/Images/Icons/TieUpsIcon.svg",
      text: "City & Province",
      label: "Republic of Karelia, Russia",
    },
    {
      icon: "/assets/Images/Icons/ExperienceIcon.svg",
      text: "World Rank",
      label: "BRICS: 261-270, EECA: 301 - 350 (2022)",
    },
    {
      icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
      text: "Amazing Fact",
      label: "Best Under 20 Lakhs",
    },
  ];
const NewPage=()=>{
    return <div className="text-regularTextPhone md:text-regularText">
        <div className="relative h-auto w-full">
        <Image src="/assets/Images/universities/russia/PetrozavodskStateUniversity.webp" alt="Kazan Federal University" layout="fill" objectFit="cover" className="z-[-1] opacity-50" />
        <div className="mx-[6vw] md:w-[73.125vw] flex flex-col gap-[6vw] py-[7.125vw] items-center md:mx-auto">
            <div className="flex flex-col items-center gap-[2vw]">
            <div className="flex flex-col items-center gap-[1vw]">
                <Breadcrumbs/>
                <h1 className="text-h3TextPhone font-bold leading-[120%] md:text-h1Text">Petrozavodsk State University</h1>
            </div>
            <p className="text-regularTexts text-center">
            Take the first step toward a rewarding medical career at Petrozavodsk State University, where innovation meets excellence in medical education, preparing students for international opportunities in healthcare.
            </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.25vw]  md:gap-[1.125vw] items-center px-[5vw] md:p-[.5vw] justify-center">
              {services.map((item, index) => (
                <div key={index} className="w-[37.5vw] md:w-[16.5vw] h-[29.25vw] md:h-[12.875vw] relative shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                            rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex flex-col items-center justify-start py-[3vw] 
                            md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
                  <Image src={item.icon}
                    alt={item.label} width={64} height={64} className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative  overflow-hidden shrink-0" />
                  <p className="text-tinyTextPhone md:text-tinyText text-center leading-[150%]"> {item.text} <br /><span className="font-semibold"> {item.label}</span></p>
                </div>
              ))}
            </div>
        </div>
        </div>
       
<section className="inner-page-bg">
  <div className="container">
    <div className="row immigrate-bg g-0">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="heading">
          <h3  className="text-h5TextPhone md:text-h5Text">Petrozavodsk State Medical University</h3>
          <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
        </div>
        <p>Petrozavodsk, the capital of Karelia in northwest Russia, is situated on the western side of Lake Onega, the second-largest lake in Europe. It is mostly well-known for the Museum of Fine Arts, which features Russian paintings and
          folk art alongside medieval icons. The National Museum of the Republic of Karelia is located near circular Lenin Square and uses natural history and archaeology exhibits to explore the history of the area.</p>
        <p>Given that Petrozavodsk is only 600 miles from Moscow and roughly 250 miles northeast of St. Petersburg, its position makes it an excellent starting point for travel throughout Russia. Interestingly, Petrozavodsk is recognized as
          Russia's historic city and is home to a number of museums, theaters, and other sites that draw tourists from all over the world. Located in Petrozavodsk, Republic of Karelia, Russia, Petrozavodsk State University is a prestigious
          and traditional university. It was renamed in 1956 after being established in 1940 as the Karelian-Finnish University. Professor Anatoly V. Voronin serves as the rector of Petrozavodsk State University. The Republic of Karelia's
          main university is Petrozavodsk State University.</p>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="row immigrate-bg g-0">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="heading">
          <h3  className="text-h5TextPhone md:text-h5Text">Why Study MBBS At Petrozavodsk State University, Russia?</h3>
          <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
        </div>
        <p><b>There are various reasons why you should choose Petrozavodsk State University to study MBBS.</b></p>
         <ul className="points-two">
          <li>Petrozavodsk State University fees are low and therefore many students have first choice to pursue MBBS in Petrozavodsk State University.</li>
          <li>Infrastructure of Petrozavodsk is world class.</li>
          <li>Petrozavodsk State University fees can be paid semester wise.</li>
          <li>Petrozavodsk State University has hassle free admission process.</li>
          <li>Petrozavodsk State University course duration is of 6 years including one year internship.</li>
          <li>All professors in Petrozavodsk State University are from highly reputed hospitals.</li>
          <li>Petrozavodsk State University admission is beneficial because the university is leader in medical training and postgraduate education retraining in central region Russia.</li>
         </ul>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3  className="text-h5TextPhone md:text-h5Text">Quick Highlights about Petrozavodsk State University, Russia</h3>
            <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <tbody>
                <tr>
                  <th scope="row">Established</th>
                  <td>1940</td>
                </tr>
                <tr>
                  <th scope="row">University Type</th>
                  <td>Public</td>
                </tr>
                <tr>
                  <th scope="row">Recognition</th>
                  <td>NMC and WHO approved</td>
                </tr>
                <tr>
                  <th scope="row">Elegibility</th>
                  <td>50% in Physics, Chemistry and Biology</td>
                </tr>
                <tr>
                  <th scope="row">Course Duration</th>
                  <td>6 Years, Including Internship</td>
                </tr> 
                <tr>
                  <th scope="row">NEET</th>
                  <td>Qualifying Marks</td>
                </tr>
                <tr>
                  <th scope="row">IELTS/TOEFL</th>
                  <td>Not Required</td>
                </tr>
                <tr>
                  <th scope="row">Medium of Teaching</th>
                  <td>English</td>
                </tr>
                <tr>
                  <th scope="row">Photos in Instagram</th>
                  <td><a href="https://www.instagram.com/edurizon/" target="_blank" className="btn-custom btn-univ-detail">Click Here</a></td>
                </tr>
                <tr>
                  <th scope="row">University &amp; Review videos</th>
                  <td><a href="https://www.youtube.com/c/EdurizonPvtLtd" target="_blank" className="btn-custom btn-univ-detail">Click Here</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="row immigrate-bg g-0">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="heading">
          <h3  className="text-h5TextPhone md:text-h5Text">Duration of MBBS in Petrozavodsk State University</h3>
          <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
        </div> 
         <ul className="points-two">
          <li>Petrozavodsk State University offers a 6 year medical degree including one year internship.</li>
          <li>The medium of instruction is English.</li>
         </ul>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
    <div className="immigrate-bg">
    <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="heading">
          <h3  className="text-h5TextPhone md:text-h5Text">About Petrozavodsk City</h3>
          <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
        </div>
        <ul className="points-two">
          <li>In northwest Russia, Petrozavodsk is a city situated on the western bank of Lake Onega.</li>
          <li>It is well-known for the Museum of Fine Arts, which features Russian paintings and folk art alongside medieval icons.</li>
          <li>The National Museum of the Republic of Karelia is located near circular Lenin Square and uses natural history and archaeology exhibits to explore the history of the area.</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container">
      <div className="immigrate-bg">
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="heading">
            <h3  className="text-h5TextPhone md:text-h5Text">Faculties of Petrozavodsk State University</h3>
            <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
          </div>
          <ul className="points-two">
            <li>Institute of Medicine.</li>
            <li>Faculty of Agriculture.</li>
            <li>Faculty of Mining and Geology.</li>
            <li>Faculty of Law.</li>
            <li>Faculty of Mathematics and IT.</li>
            <li>Faculty of Physics and Technology.</li>
            <li>Faculty of Philology.</li>
            <li>Faculty of Ecology and Biology.</li>
            <li>Preparatory Faculty.</li>
            <li>Institute of Foreign Languages.</li>
            <li>Institute of Pedagogy and Psychology.</li>
            <li>Institute of History, Political and Social Sciences.</li>
            <li>Institute of Forestry, Engineering and Construction Sciences.</li>
          </ul>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
        <div className="heading">
          <h3  className="pt-2 text-h5TextPhone md:text-h5Text">Recognitions of Petrozavodsk State University</h3>
          <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
        </div> 
        <ul className="points-two">
          <li>World Health Organization (WHO).</li>
          <li>National Medical Commission (NMC).</li>
          <li>Ministry of Science and Higher Education of the Russian Federation.</li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</section> 
<section className="inner-page-bg">
  <div className="container">
    <div className="row g-0">
      <div className="immigrate-bg">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3  className="text-h5TextPhone md:text-h5Text">Petrozavodsk State University Ranking 2023-2024</h3>
            <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
          </div>
          <p>Petrozavodsk State University Ranking in Country - <b>64</b></p>
          <p>Petrozavodsk State University World Ranking - <b>2591</b></p> 
        </div>
      </div>
    </div>
  </div>
</section>
<section className="inner-page-bg">
  <div className="container"> 
      <div className="immigrate-bg">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="heading">
              <h3  className="text-h5TextPhone md:text-h5Text">Fee Structure of Petrozavodsk State University 2024-25</h3>
              <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <tbody>
                  <tr>
                    <th scope="row">Tuition Fees</th>
                    <td>2,85,000 Rubels /Year</td>
                  </tr>
                  <tr>
                    <th scope="row">Hostel/Yearly</th>
                    <td>16,800 Rubel</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Visa, medical insurance, biometric, self food or mess food, air ticket and your pocket money will be extra charge.</p>
            <p><b>Note: 1 USD = 83 INR. The mentioned fee is approximate and will be subject to change.</b></p>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="heading">
              <h3 className="pt-2 text-h5TextPhone md:text-h5Text">Eligibility To Study MBBS In Petrozavodsk State University</h3>
              <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
            </div>
            <p><b>Following eligibility criteria to get admission in Petrozavodsk State University for MBBS course:</b></p>
            <ul className="points-two">
              <li>Candidates must be 17 years above or take admission before 31st December to do MBBS in Russia.</li>
              <li>Every candidate must score more than 50% in the HSC exam or in similar courses with Physics, Chemistry, Biology and English as compulsory subjects.</li>
              <li>Students who have cleared the NEET examination with an eligible score can apply for the MBBS course in State Medical University.</li>
            </ul> 
          </div>
        </div>
      </div> 
  </div>
</section>

<section className="inner-page-bg">
  <div className="container">
    
      <div className="immigrate-bg">
        <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="heading">
            <h3  className="text-h5TextPhone md:text-h5Text">Documents Required for Petrozavodsk State University</h3>
            <h5>MBBS in Russia – MBBS in Petrozavodsk State University</h5>
            <p><b>Please carry all these related documents before admission to Petrozavodsk State Medical University.</b></p>
          </div>
          <ul className="points-two">
            <li>Passport (Minimum 18 months validity).</li>
            <li>10th Certificate & Mark sheet.</li>
            <li>12th Certificate & Mark sheet.</li>
            <li>Birth Certificate.</li>
            <li>10 passport-size Photographs.</li>
            <li>Official Invitation letter from the Medical University of Russia.</li>
            <li>Authorization of all documents from the Ministry of External Affairs, New Delhi.</li>
            <li>Legalization of all documents from the Russian Embassy.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section> 
    </div>
}

export default NewPage;