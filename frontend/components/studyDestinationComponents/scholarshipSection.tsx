interface ScholarshipSectionProps {
    id: string;
    data:{
        title:string;
        content:{[key:string]:string}[];
    };
}



const ScholarshipSection = ({ id,data }: ScholarshipSectionProps) => {
    return (
        <div className=" flex flex-col items-center mx-[6vw] md:mx-[12.5vw] gap-[4vw] md:gap-[4vw] py-[4vw]">
            <h3 className="text-h5TextPhone md:text-h3Text text-center font-bold leading-[130%]">{data.title}</h3>
            <div className="flex flex-col gap-[2vw]">
            {data.content.map((content, i) => (
                <div key={i} className="flex flex-col  gap-[1vw]">
                    <h4 className="text-h5TextPhone md:text-h4Text opacity-60 font-bold leading-[130%]">{content.title}</h4>
                    <p className="text-regularTextPhone md:text-regularText text-justify ">{content.description}</p>
                </div>
            ))}
            </div>
        </div>
    );
    }

export default ScholarshipSection;