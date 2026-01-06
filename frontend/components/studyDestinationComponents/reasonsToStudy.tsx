interface ReasonsToStudyProps {
    id: string;
    name?:string;
    title1:string;
    title2?:string;
    content:{[key:string]:string}[];
    darkImg:string[];
    lightImg:string[];
}
import ThemeContext from "@/context/themeContext";
import Image from "next/image";
import { useContext, useState } from "react";
  
const ReasonsToStudy = ({ id,name,content,darkImg,lightImg,title1,title2 }: ReasonsToStudyProps) => {
    const useTheme=()=>useContext(ThemeContext);
    const { theme } = useTheme();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const imageSrc =
      theme == "dark"?
      darkImg:
      lightImg;
    return (
        <div className="md:m-[4vw] flex flex-col gap-[8vw] md:gap-[4vw] mx-[6vw] md:mx-[12.5vw] pb-[8vw] md:pb-0">
            <h4 className="text-h4TextPhone md:text-h4Text text-center leading-[130%] font-bold">{title1} {title2}</h4>
            <div className="flex flex-col  md:grid md:grid-cols-3 gap-[8vw] md:gap-[4vw] ">
            {content.map((reason, index) => {
                    const isExpanded = expandedIndex === index;
                    const desktopText = reason.description || "";
                    const mobileText = (reason.mobileDescription || reason.description || "");
                    // Heuristic: if either desktop or mobile text is long enough to likely clamp, show toggle
                    const shouldShowToggle = desktopText.length > 160 || mobileText.length > 160;
                    return (
                    <div key={index} className="flex flex-col gap-[6vw] items-center md:items-start md:gap-[1.5vw]">
                    <Image
                        src={`/assets/Images/CountryBlogs/ReasonsRussia/${imageSrc[index]}.png`}
                        width={64}
                        height={64}
                        alt={`Reason ${index + 1}`}
                        className="w-[16vw] mx-auto md:mx-0 md:w-[4vw] h-auto"
                    />
                    <div className="text-justify">
                        <h6 className="leading-[120%] text-h6TextPhone md:text-left md:text-h6Text font-bold">
                        <span className="hidden md:inline">{reason.title}</span>
                        <span className="md:hidden">{reason.title}</span>
                        </h6>
                        <p className={`leading-[150%]  md:text-left text-regularTextPhone md:text-regularText font-light ${!isExpanded ? "line-clamp-3" : ""}`}>
                        <span className="hidden md:inline ">{reason.description}</span>
                        <span className="md:hidden">{reason.mobileDescription || reason.description}</span>
                        </p>
                        {shouldShowToggle && (
                          <button
                            type="button"
                            className="mt-1 text-primary underline text-regularTextPhone md:text-sm"
                            onClick={() =>
                              setExpandedIndex(isExpanded ? null : index)
                            }
                          >
                            {isExpanded ? "Less" : "More"}
                          </button>
                        )}
                    </div>
                    {/* <h6 className="text-h6TextPhone md:text-h6Text underline">Learn More</h6> */}
                    </div>
                    );
                })}
            </div>
        </div>
    );
    }

export default ReasonsToStudy;