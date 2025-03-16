interface Section1Props {
    id: string;
}
import ThemeContext from "@/context/themeContext";
import Image from "next/image";
import { useContext } from "react";

const Section1 = ({ id }: Section1Props) => {
    const useTheme=()=>useContext(ThemeContext);
    const { theme } = useTheme();
    console.log(theme);
    const imageSrc =
      theme == "dark"?
      ["1Dark","2Dark","3Dark","4Dark","5Dark","6Dark"]:
      ["1","2","3","4","5","6"];
    return (
        <div className="md:m-[4vw] flex flex-col gap-[8vw] md:gap-[4vw] mx-[6vw] md:mx-[12.5vw]">
            <h4 className="text-h4TextPhone md:text-h4Text text-center md:text-left leading-[130%]">6 Reasons Why Indian<br/>Students Prefer {id[0].toUpperCase() + id.substring(1)} for MBBS</h4>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-[16vw] md:gap-[4vw]">
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[0]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">Globally Accredited Medical Degrees</span>
                    <span className="md:hidden">Globally Valid Degrees</span>
                    </h6>

                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    <span className="hidden md:inline">
                        Medical universities in China are recognized by global organizations like the World Health Organization (WHO) and are listed in the World Directory of Med.
                    </span>
                    <span className="md:hidden">
                        Russian medical degrees are accredited by WHO, UNESCO, NMC, ECFMG, and FAIMER, ensuring .......
                    </span>
                    </p>

                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[1]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">Affordable Tuition Fees & Living Costs</span>
                    <span className="md:hidden">Affordability</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    Russia offers world-class medical education at a fraction of the cost of Indian private colleges: .......
                    </p>

                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[2]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">No Entrance Exams or Donations</span>
                    <span className="md:hidden">No Entrance Exams</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    Admission is based solely on Class 12 marks (50% in PCB) and a valid NEET score, eliminating the stress of ......
                    </p>
                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-[16vw]  md:gap-[4vw]">
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[3]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">English-Medium Curriculum</span>
                    <span className="md:hidden">English-Medium Curriculum</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    Admission is based solely on Class 12 marks (50% in PCB) and a valid NEET score, eliminating the stress of......
                    </p>
                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[4]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">Advanced Infrastructure & Research Opportunities</span>
                    <span className="md:hidden">Practical Training</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    Students gain hands-on experience from the very first year in government hospitals.
                    </p>
                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
                <div className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw] ">
                    <Image src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[5]}.png`} width={64} height={64} alt="1" className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"/>
                    <div>
                    <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                    <span className="hidden md:inline">Safe & Welcoming Environment</span>
                    <span className="md:hidden">Indian Community Support</span>
                    </h6>
                    <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                    Cities like Kazan and Moscow host thriving Indian student communities, celebrating festivals like Diwali and .......
                    </p>
                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                </div>
            </div>
        </div>
    );
    }

export default Section1;