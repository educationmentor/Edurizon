interface Section1Props {
    id: string;
}



const Section1 = ({ id }: Section1Props) => {
    return (
        <div className="m-[4vw] flex flex-col gap-[4vw]">
            <h4 className="text-h4Text leading-[130%]">6 Reasons Why Indian<br/>Students Prefer {id[0].toUpperCase() + id.substring(1)} for MBBS</h4>
            <div className="flex gap-[4vw]">
                <div className="flex flex-col gap-[2vw] ">

                </div>
            </div>
            <div className="flex gap-[4vw]">

            </div>
        </div>
    );
    }

export default Section1;