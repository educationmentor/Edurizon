interface ReasonsToStudyProps {
    id: string;
    name:string;
    title1:string;
    title2:string;
    content:{[key:string]:string}[];
    darkImg:string[];
    lightImg:string[];
}
import ThemeContext from "@/context/themeContext";
import Image from "next/image";
import { useContext,useState } from "react";
  
const RussiaReasonsToStudy = ({ id,name,content,darkImg,lightImg,title1,title2 }: ReasonsToStudyProps) => {
    const useTheme=()=>useContext(ThemeContext);
    const { theme } = useTheme();
    const [showOverlay, setShowOverlay] = useState(false);
    console.log(theme);
    const imageSrc =
      theme == "dark"?
      darkImg:
      lightImg;
    return (
        <div className="md:m-[4vw] flex flex-col gap-[8vw] md:gap-[4vw] mx-[6vw] md:mx-[12.5vw]">
            <h4 className="text-h4TextPhone md:text-h4Text text-center leading-[130%] ">{title1} {title2}</h4>
            <div className="flex flex-col  md:grid md:grid-cols-3 gap-[16vw] md:gap-[4vw]">
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[0]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${0 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[0].title}</span>
                    <span className="md:hidden">{content[0].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">{content[0].description}</span>
                    <span className="md:hidden">{content[0].mobileDescription || content[0].description}</span>
                    </p>
                </div>
                {/* <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[1]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${1 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[1].title}</span>
                    <span className="md:hidden">{content[1].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">{content[1].description}</span>
                    <span className="md:hidden">{content[1].mobileDescription || content[1].description}</span>
                    </p>
                </div>
                {/* <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[2]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${2 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[2].title}</span>
                    <span className="md:hidden">{content[2].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light underline">Key Features of NMC Gazetter 2011-</p>
                    <ul className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light list-disc list-inside">
                        <li>Minimum duration of MBBS must be at least 54 months or 4.5 years</li>
                    </ul>
                    <h6 onClick={()=>setShowOverlay(true)} className="text-h6TextPhone md:text-h6Text underline cursor-pointer">Learn More</h6>
                </div>
                
                </div>
                <div  className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[3]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${3 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[3].title}</span>
                    <span className="md:hidden">{content[3].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">{content[3].description}</span>
                    <span className="md:hidden">{content[3].mobileDescription || content[3].description}</span>
                    </p>
                </div>
                {/* <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[4]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${4 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[4].title}</span>
                    <span className="md:hidden">{content[4].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">{content[4].description}</span>
                    <span className="md:hidden">{content[4].mobileDescription || content[4].description}</span>
                    </p>
                </div>

                {/* <h6  className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                <Image
                    src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[5]}.png`}
                    width={64}
                    height={64}
                    alt={`Reason ${5 + 1}`}
                    className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                />
                <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">{content[5].title}</span>
                    <span className="md:hidden">{content[5].mobileTitle}</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">{content[5].description}</span>
                    <span className="md:hidden">{content[5].mobileDescription || content[5].description}</span>
                    </p>
                </div>
                {/* <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                </div>
            </div>
             {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-[.5vw] md:max-w-[40vw] w-full relative">
            <button
              className="absolute top-2 right-3 text-gray-700 text-lg font-bold"
              onClick={() => setShowOverlay(false)}
            >
              ✕
            </button>
            <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light underline mb-[2vw] md:mb-[1vw]">Key Features of NMC Gazetter 2021-</p>
            <ul className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light list-disc list-inside">
                <li>Minimum duration of MBBS must be at least 54 months or 4.5 years</li>
                <li>Mandatory to complete 12-months internship from the same university</li>
                <li>Entire MBBS program should be in English.</li>
                <li>Need to write NExT Exam (replacing FMGE)</li>
                <li>Must obtain licence to practice from the same Country.</li>
                <li>Students cannot change a college/university in his/her mid-semester/mid-year.</li>
            </ul>
            <a href="/assets/Images/NMC-gazette-letter.jpg">
            <p className="text-red-500 cursor-pointer  ">Russia fulfils all criteria as laid down in NMC gazette 2021 (click to view)</p>
            </a>
            <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light underline  mt-[1vw]">LICENCING EXAM</p>
            <ul className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light list-disc list-inside">
                <li>The licencing exam in Russia shall be conducted in Russian Language only.</li>
            </ul>
          </div>
        </div>
      )}
        </div>
    );
    }

export default RussiaReasonsToStudy;