import Breadcrumbs from "@/components/Breadcumbs";
import RelatedCountries from "@/components/studyDestinationComponents/relatedCountries";
import Image from "next/image";
const services = [
  {
    icon: "/assets/Images/Icons/feesIcon.svg",
    text: "Tution Fees | Hostel Fees",
    label: "$4500 | $500",
  },
  {
    icon: "/assets/Images/Icons/TieUpsIcon.svg",
    text: "City & Province",
    label: "Dushanbe, Tajikistan",
  },
  {
    icon: "/assets/Images/Icons/ExperienceIcon.svg",
    text: "QS World Rank - 561",
    label: "Country Rank - 1 ",
  },
  {
    icon: "/assets/Images/Icons/AcademinCoursesIcon.svg",
    text: "Amazing Fact",
    label: "Eurpoean & Central Asian Rank - 36",
  },
];
const NewPage=()=>{
    return(
        <div className="text-smallTextPhone md:text-smallText">
            <div className="mx-[6vw] md:w-[73.125vw] flex flex-col gap-[5vw] mb-[1vw] py-[4vw] items-center md:mx-auto">
                <div className="flex flex-col items-center gap-[2vw] md:gap-[2vw]">
                <div className="flex flex-col items-center gap-[4vw] md:gap-[1vw]">
                    <Breadcrumbs/>
                    <h1 className="text-h4TextPhone text-center   font-bold leading-[120%] md:text-h1Text">Tajik National University, Tajikistan</h1>
                </div>
                <p className="text-smallTextPhone text-left md:text-regularText md:text-center">
                Tajik National University, TNU was established by the Resolution of Soviet of Ministries of the USSR on 21st March 1947. Tajik National University started its functioning from 1st September 1848 in Dushanbe.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[2.25vw]  md:gap-[1.125vw] items-center px-[5vw] md:p-[.5vw] justify-center">
                  {services.map((item, index) => (
                    <div key={index} className="w-[37.5vw] md:w-[16.5vw] h-[29.25vw] md:h-[12.875vw] relative shadow-[0px_.25vw_2.46875vw_rgba(0,_0,_0,_0.25)] dark:shadow-[0px_.25vw_2.46vw_rgba(255,_255,_255,_0.25)] 
                                rounded-[3.75vw] md:rounded-[1.875vw] bg-white overflow-hidden shrink-0 flex flex-col items-center justify-start py-[3vw] 
                                md:py-[1.5vw] px-[3.875vw] md:px-[1.937vw] box-border gap-[1vw] text-center text-regularText text-black">
                      <Image src={item.icon}
                        alt={item.label} width={64} height={64} className="w-[8.5vw] h-[8.5vw] md:w-[4.25vw] md:h-[4.25vw] relative  overflow-hidden shrink-0" />
                      <p className="text-tinyTextPhone md:text-regularText text-center leading-[150%]"> {item.text} <br /><span className="font-semibold"> {item.label}</span></p>
                    </div>
                  ))}
                </div>
            </div>
            <Image src="/assets/Images/mbbs-in-tajikistan/tajik-national-university/Tajikistan1.png" alt="Tajikistan" width={1920} height={1080} className="w-full h-auto"/>

            {/* Mbbs from Tajik national University */}
            <section className="mx-[6vw] md:mx-[12.5vw] py-[10vw] md:py-[4vw]">
              <h3 className="text-h5TextPhone leading-[120%] mb-[4vw] md:mb-[1vw] text-center md:text-h3Text">MBBS From Tajik National University</h3>
              <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">
              Tajik National University, TNU was established by the Resolution of Soviet of Ministries of the USSR on 21st March 1947. Tajik National University started its functioning from 1st September 1848 in Dushanbe. Tajik National University is one of a leading centre in training qualified specialists for the different spheres of the national economy of the country.
The State University of Tajikistan named after V.I. Lenin from 1957 was renamed into State University of Tajikistan in 1992 and subsequently Tajik State National University in the year 1997.
Tajik National University is the first and largest university in Tajikistan. It enrolls 23,000 students per year in 18 different academic disciplines.
              </p>
            </section>

           {/* Dubane */}
           <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw] pt-[5vw] md:pt-[2vw] flex md:flex-row flex-col-reverse items-center gap-[6vw] md:gap-[5vw] "> 
                  <div className="flex flex-col gap-[3vw] md:gap-[1.5vw] w-full md:w-[37.5vw] flex-shrink-0 ">
                    <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text">DUSHANBE CITY</h3>
                    <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">Dushanbe is the capital of Tajikistan which is situated on the Varzob River. Rudaki Park which is named after a classical poet is situated on the east bank of the river.</p>
                    <h4 className="text-h6TextPhone leading-[120%] md:text-h4Text">Tajik National University main campus</h4>
                    <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">The head office of Tajik National university, TNU is located in Dushanbe city which is also capital of Tajikistan. The campus of TNU is spread over in 500 acres.</p>
                    <h4 className="text-h6TextPhone leading-[120%] md:text-h4Text">Tajik National University - History</h4>
                    <p className="text-smallTextPhone text-left md:text-regularText md:text-justify">TNU was formed on 21 March 1947. In the year 2009, a high school and Mathematics discipline were established at the university.</p>
                  </div>
                  <Image src="/assets/Images/mbbs-in-tajikistan/tajik-national-university/Tajikistan2.png" alt="Tajikistan" width={1920} height={1080} className="w-full  h-auto rounded-[4vw] md:rounded-[1vw]"/>
           </section>
           {/* Tajik National University Facilities */}

           <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw] pt-[5vw] md:pt-[2vw] ">
                  <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text mb-[3vw] md:mb-[1.5vw]">Tajik National University - Facilities</h3>
                  <p className="text-smallTextPhone text-left md:text-regularText md:text-justify leading-[150%] ">Tajik National University, TNU encompasses publishing, a research library, a botanical garden, a hostel, 114 departments (107 special departments) and a military chair and high school.
                  </p>
                  <ul className="list-disc pl-[4vw] md:pl-[1.5vw] list-outside text-smallTextPhone text-left md:text-regularText md:text-justify leading-[150%]">
                    <li>TNU has 198 doctors, professors and 632 candidates of sciences.</li>
                    <li>TNU has 8 dissertation councils and 26 Academic departments.</li>
                    <li>TNU has scientific library with 945000 copies of scientific, educational, fiction and periodicals.</li>
                    <li>TNU Research Institutes offers 110 research laboratories, electronic library with access to more than 12 million digital online sources, bio-technology Centre, Techno Park, Center for Language Studies, Cultural Education Center “Confucius”, Center of periodicals, printing and translation center. It emphasizes “Russian world”, and the cultural centers of Iran and Pakistan.</li>
                  </ul>
           </section>

           {/* Tajik National University Notable Alumini */}
           <section className="mx-[6vw] md:mx-[12.5vw] pb-[10vw] md:pb-[4vw] pt-[5vw] md:pt-[2vw] ">
                  <h3 className="text-h5TextPhone leading-[120%] md:text-h3Text mb-[3vw] md:mb-[1.5vw]">Tajik National University - Notable Alumini</h3>
                  <p className="text-smallTextPhone text-left md:text-regularText md:text-justify leading-[150%] ">Tajik National University, TNU, prepares extensive human resources for the economy of Tajikistan, from journalists to finance professionals and managers.
                  President <a href="https://en.wikipedia.org/wiki/Emomali_Rahmon" className="underline">Emomali Rahmon</a> and the former chairman of the <a href="https://en.wikipedia.org/wiki/National_Bank_of_Tajikistan" className="underline">National Bank of Tajikistan</a> Murodali Alimardon are alumni of Tajik National University, TNU.
                  </p>
           </section>

            

        </div>

    )
}

export default NewPage;