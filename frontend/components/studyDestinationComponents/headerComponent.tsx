import { ReactNode } from "react";
import Breadcrumbs from "../Breadcumbs";

interface HeaderProps {
    id: string;
    title1:string;
    title2:string;
    description:string;
    description2?:string;
    section?:ReactNode;
    subTitle?:string
}



const Header = ({ id,title1,title2,description, description2,section,subTitle } : HeaderProps) => {
    return (
        <div id='header' className="flex flex-col mx-[6vw] md:mx-[12.5vw] items-center pt-[5vw] md:pt-[3vw]  ">
        <Breadcrumbs />
        

        <div className="">
        <h1 className="text-h4TextPhone md:text-h2Text font-bold text-center leading-[120%]">{title1}</h1>
        <h2 className="md:w-[58.5vw] text-h5TextPhone md:text-h2Text  font-bold text-center leading-[120%]">{title2}</h2>
        </div>
        {
            section &&
            section
        }
        {
            subTitle &&
            <h4 className="text-h4TextPhone md:text-h4Text text-left leading-[130%] font-bold mb-[1vw]">{subTitle}</h4>

        }

        
        <p className="text-smallTextPhone md:text-regularText text-justify ">
        {description}
        </p>
        {description2 &&<p className="hidden md:block text-smallTextPhone md:text-regularText text-justify mt-[2vw] md:mt-[2vw] ">
            {description2}
            </p>}
      </div>
    );
    }

export default Header;