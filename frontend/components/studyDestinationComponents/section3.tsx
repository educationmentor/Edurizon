import { TransitionLink } from "@/utils/TransitionLink";

interface Section3Props {
    id: string;
    data:string;
}



const Section3 = ({ id,data }: Section3Props) => {
    return (
        <div className=" flex flex-col  mx-[6vw] md:mx-[12.5vw] gap-[6vw] md:gap-[1.5vw] ">
            <h3 className="text-h5TextPhone md:text-h3Text text-left md:text-center font-bold leading-[130%] ">NMC Approved Medical <br/>Colleges in Russia</h3>
            <p className="w-full md:w-[47.5vw] text-regularTextPhone mx-auto md:text-regularText text-justify md:text-center pb-[2vw] md:pb-[2vw]">{data}</p>
            <h5 className="text-h6TextPhone md:text-h4Text font-bold leading-[130%] text-left md:text-center">Top NMC-Approved Medical Universities in Russia</h5>
            <p className="text-smallTextPhone md:text-regularText leading-[150%] ">When it comes to choosing the best university in Russia for mbbs, Indian students have several options. Edurizon has identified five top MBBS universities that highly excel in quality & recognition.</p>
            <ul className="font-bold text-mediumText text-left list-inside list-disc" >
                
                <TransitionLink href="/study-destinations/study-mbbs-in-russia/kazan-federal-university"><li >Kazan Federal University</li></TransitionLink>
                <TransitionLink href="/study-destinations/study-mbbs-in-russia/immanuel-kant-baltic-federal-university">
                <li>Immanuel Kant Baltic Federal University</li></TransitionLink>
                <TransitionLink href="/study-destinations/study-mbbs-in-russia/north-western-state-medical-university">
                <li>North Western State Medical University</li></TransitionLink>
                <TransitionLink href="/study-destinations/study-mbbs-in-russia/bashkir-medical-university">
                <li>Bashkir State Medical University</li></TransitionLink>
                <TransitionLink href="/study-destinations/study-mbbs-in-russia/tambov-state-university">
                <li>Tambov State University</li></TransitionLink>
            </ul>
        </div>
    );
    }

export default Section3;