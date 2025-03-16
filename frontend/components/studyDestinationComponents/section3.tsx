interface Section3Props {
    id: string;
    data:string;
}



const Section3 = ({ id,data }: Section3Props) => {
    return (
        <div className=" flex flex-col items-center mx-[6vw] md:mx-[12.5vw] gap-[6vw] md:gap-[1.5vw] ">
            <h3 className="text-h5TextPhone md:text-h3Text text-center font-bold leading-[130%]">Top MCI / NMC-Approved<br/>Universities</h3>
            <p className="w-full md:w-[47.5vw] text-regularTextPhone md:text-regularText text-justify md:text-center">{data}</p>
        </div>
    );
    }

export default Section3;