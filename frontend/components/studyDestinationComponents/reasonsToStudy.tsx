interface ReasonsToStudyProps {
    id: string;
    name:string;
    content:{[key:string]:string}[]
}
import ThemeContext from "@/context/themeContext";
import Image from "next/image";
import { useContext } from "react";
  
const ReasonsToStudy = ({ id,name,content }: ReasonsToStudyProps) => {
    const useTheme=()=>useContext(ThemeContext);
    const { theme } = useTheme();
    console.log(theme);
    const imageSrc =
      theme == "dark"?
      ["1Dark","2Dark","3Dark","4Dark","5Dark","6Dark"]:
      ["1","2","3","4","5","6"];
    return (
        <div className="md:m-[4vw] flex flex-col gap-[8vw] md:gap-[4vw] mx-[6vw] md:mx-[12.5vw]">
            <h4 className="text-h4TextPhone md:text-h4Text text-center md:text-left leading-[130%]">6 Reasons Why Indian<br/>Students Prefer {name} for MBBS</h4>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-[16vw] md:gap-[4vw]">
                {content.map((reason, index) => (
                    <div key={index} className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                    <Image
                        src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[index]}.png`}
                        width={64}
                        height={64}
                        alt={`Reason ${index + 1}`}
                        className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                    />
                    <div>
                        <h6 className="leading-[120%] text-h6TextPhone text-center md:text-left md:text-h6Text font-bold">
                        <span className="hidden md:inline">{reason.title}</span>
                        <span className="md:hidden">{reason.mobileTitle}</span>
                        </h6>
                        <p className="leading-[150%] text-center md:text-left text-regularTextPhone md:text-regularText font-light">
                        <span className="hidden md:inline">{reason.description}</span>
                        <span className="md:hidden">{reason.mobileDescription || reason.description}</span>
                        </p>
                    </div>
                    <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6>
                    </div>
                ))}
            </div>
        </div>
    );
    }

export default ReasonsToStudy;