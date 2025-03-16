import Breadcrumbs from "../Breadcumbs";

interface HeaderProps {
    id: string;
    title1:string;
    title2:string;
    description:string;
}



const Header = ({ id,title1,title2,description }: HeaderProps) => {
    return (
        <div id='header' className="flex flex-col mx-[6vw] md:mx-[12.5vw] items-center pt-[10vw] md:pt-[7vw] md:pb-[3vw] gap-[4vw] md:gap-[1vw]">
        <Breadcrumbs />
        <div className="mb-[4vw] md:mb-[4vw]">
        <h1 className="text-h4TextPhone md:text-h1Text font-bold text-center leading-[120%]">{title1}</h1>
        <h2 className="md:w-[58.5vw] text-h5TextPhone md:text-h2Text font-bold text-center leading-[120%]">{title2}</h2>
        </div>
        <p className="text-smallTextPhone md:text-regularText text-center ">
        {description}
        </p>
      </div>
    );
    }

export default Header;