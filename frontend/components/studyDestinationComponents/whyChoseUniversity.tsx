interface WhyChoseUniversityProps {
    id: string;
    content: string[][];
    title: string;
    imageURL: string;
}

import Image from "next/image";

const WhyChoseUniversity = ({ id,title,content,imageURL}: WhyChoseUniversityProps) => {
    return (
        <div className=" flex flex-col-reverse md:flex-row gap-[5vw] px-[6vw] md:px-[12.5vw] dark:text-black bg-linenChosen py-[10vw] md:py-[4vw] items-center  ">
            <div className="flex flex-col gap-[1.5vw] w-full md:w-[39.625vw]">
                <h3 className="text-h5TextPhone md:text-h3Text font-bold leading-[130%]">
                {title}
                </h3>

                <ul className="list-disc pl-[6vw] md:pl-[1.5vw] list-outside md:text-regularText text-regularTextPhone ">
                    {content.map((data, index) => (
                        <li key={index}>
                            {data.length >1 ?(data.map((item, i) => (
                                <span key={i}>{item}<br/></span>
                            ))) :
                            (<><strong> {data[0].split(":")[0]}</strong><span> {": " + data[0].split(":")[1]}</span></>)
                            }
                        </li>
                    ))}
                </ul>
            </div>
            <Image alt="whyChoseRussia" width={490} height={470} className="w-full md:w-[30.5vw] rounded-[4vw] md:rounded-[1vw] h-auto" src={imageURL}/>
        </div>
    );
    }

export default WhyChoseUniversity;