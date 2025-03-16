interface Section5Props {
    id: string;
}



const Section5 = ({ id}: Section5Props) => {
    return (
        <div className=" flex flex-col items-center gap-[1.5vw] ">
            <h3 className="text-h3Text text-center font-bold leading-[130%]">Top MCI / NMC-Approved<br/>Universities</h3>
            <p className="w-[47.5vw] text-center"></p>
        </div>
    );
    }

export default Section5;