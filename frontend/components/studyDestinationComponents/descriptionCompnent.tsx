interface DescriptionComponentProps {
    id: string;
    title1normal:string;
    title1orange?:string;
    title2?:string;
    content1:string[];
    content2?:string[];
    imageSrc:string;
    imageAlt:string;
    para?:string;
}

import Image from "next/image";

const DescriptionComponent = ({ id,title1normal,title1orange,title2,content1,content2,imageAlt,imageSrc,para="" }: DescriptionComponentProps) => {
    return (
        <div id='description' className="flex md:flex-row flex-col-reverse gap-[6vw] md:gap-[5vw] mx-[6vw] md:mx-[12.5vw] ">
                  <div className="md:w-[37.625vw] flex flex-col gap-[8vw] md:gap-[2vw] my-auto">
                    <h3 className="text-h5TextPhone text-center md:text-left md:text-h3Text font-bold leading-[120%]">{title1normal}{" "}<br/><span className="text-orangeChosen">{title1orange}</span></h3>
                    {para && <p className="text-smallTextPhone md:text-regularText text-justify">{para}</p>}
                    <div className="text-smallTextPhone md:text-regularText text-justify">
                    {content1.length>1?
                    <ul className="list-disc pl-[6vw] md:pl-[1.5vw] list-outside ">
                        {content1.map((data, index) => (
                        <li key={index}>{data}</li>
                    ))}
                    </ul>:content1[0]}
                    
                    </div>
                    
                    {title2 && <h4 className="text-h5TextPhone text-center md:text-left md:text-h4Text font-bold leading-[120%]">{title2}</h4>}
                    <div className="text-smallTextPhone md:text-regularText text-justify">
                    {content2 !=undefined? content2.length>1?
                    <ul className="list-disc pl-[6vw] md:pl-[1.5vw] list-outside ">
                        {content2.map((data, index) => (
                        <li key={index}>{data}</li>
                    ))}
                    </ul>:content2[0]:""}
                    
                    </div>
                    
                  </div>
                <Image width={500} height={500} className="rounded-full w-full md:w-[32.375vw] px-[3vw] md:px-0 h-auto" src={imageSrc} alt={imageAlt} />
        </div>
    );
    }

export default DescriptionComponent;