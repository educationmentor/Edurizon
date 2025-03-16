interface Section2Props {
    id: string;
}
import Image from "next/image";


const Section2 = ({ id }: Section2Props) => {
    return (
        <div className=" flex flex-col md:flex-row gap-[10vw] md:gap-0 items-center justify-between dark:text-black bg-linenChosen py-[10vw] md:py-[4vw] px-[6vw] md:px-[12.5vw] mb-[10vw] md:mb-[4vw]">
            <div className="md:w-[40vw] flex flex-col gap-[1.5vw]">
                <h3 className="text-h5TextPhone md:text-h3Text leading-[120%]  font-bold">Why Do These Reasons Matter for Indian Students?</h3>
                <ul className="text-regularTextPhone md:text-regularText italic list-disc list-inside">
                    <li>
                    ROI Focused: Save ₹50–70 lakhs compared to Indian private colleges.
                    </li>
                    <li>
                    Global Mobility: Work in India, the EU, or the Middle East post-graduation.
                    </li>
                    <li>
                    Stress-Free Journey: No cutthroat competition for seats or language barriers.
                    </li>
                    <li>
                    Cultural Familiarity: Celebrate traditions while adapting to a new environment.
                    </li>
                </ul>
            </div>
            <div className="md:w-[30.625vw]">
                <Image src="/assets/Images/CountryBlogs/didYouKnow.png" width={405} height={512} alt="Did you Know" className="ml-auto w-full mb-[2vw] md:mb-0 md:w-[25.3125vw] h-auto"/>
                <h5 className="font-bold text-h5TextPhone md:text-h3Text text-right italic">Did You Know?</h5>
                <ul className="text-regularTextPhone md:text-regularText text-right italic font-bold list-disc list-inside">
                    <li>
                        Over 4,000 Indian students are currently studying MBBS in Russia.
                    </li>
                    <li>
                        Russian medical universities have a  70–85% FMGE pass rate (higher than many Asian countries).
                    </li>
                </ul>
            </div>
        </div>
    );
    }

export default Section2;