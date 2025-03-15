interface Section2Props {
    id: string;
    data:string;
}



const Section2 = ({ id,data }: Section2Props) => {
    return (
        <div className=" flex flex-col items-center gap-[1.5vw] mb-[4vw]">
            <h3 className="text-h3Text text-center font-bold leading-[130%]">Top MCI / NMC-Approved<br/>Universities</h3>
            <p className="w-[47.5vw] text-center">{data}</p>
        </div>
    );
    }

export default Section2;