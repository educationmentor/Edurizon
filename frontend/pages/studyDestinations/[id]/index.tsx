import Breadcrumbs from "@/components/Breadcumbs";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Section1 from "../../../components/studyDestinationComponents/section1";
interface NewPageProps {
  id: string;
  countryData:  { 
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    metaCanonical: string;
    countryName: string;
    countryDescription:string;
    countryWhyChoseSection:{ [key: string]: string}
    countrySpecificSection1:boolean;
    countrySpecificSection2:boolean;
    countryCostData:{[key:string]:string};
    countrySpecificSection3:{data:string};
    countryUniversities:{
      universityName:string;
      location:string;
      annualFees:string;
      gloablRanking:string;
      highlights:string[];
    }[];
    countryFeeStructure:{[key:string]:string};
    countryEligibilityStructure:{[key:string]:string[]};
    countrySpecificSection4:boolean;
    countrySpecificSection5:boolean;
   };
}


const NewPage = ({ id,countryData }: NewPageProps) => {
  
  return (
    <>
    <Head>
        <title>{countryData.metaTitle}</title>
        <meta name="description" content={countryData.metaDescription} />
        <meta name="keywords" content={countryData.metaKeywords} />
        <meta name="author" content="Edurizon" />
        <link rel="canonical" href={countryData.metaCanonical} />
    </Head>
    <div className="flex flex-col gap-[10vw] md:gap-[4vw] justify-center  ">

      {/* Header Part */}
      <div id='header' className="flex flex-col mx-[6vw] md:mx-[12.5vw] items-center pt-[10vw] md:pt-[7vw] md:pb-[3vw] gap-[4vw] md:gap-[1vw]">
        <Breadcrumbs />
        <h1 className="mb-[4vw] md:mb-[4vw] text-h4TextPhone md:text-h1Text font-bold text-center leading-[120%]">Study MBBS In { countryData.countryName }<br/>2025-26</h1>
        <p className="text-smallTextPhone md:text-regularText text-center md:text-left">
        {countryData.countryDescription}
        </p>
      </div>

      {/* Description Part */}
      <div id='description' className="flex md:flex-row flex-col-reverse gap-[6vw] md:gap-[5vw] mx-[6vw] md:mx-[12.5vw] ">
          <div className="md:w-[37.625vw] flex flex-col gap-[8vw] md:gap-[2vw] my-auto">
            <h3 className="text-h5TextPhone text-center md:text-left md:text-h3Text font-bold leading-[120%]">Why Should You Choose to Study <span className="text-orangeChosen">MBBS in {countryData.countryName}</span>?</h3>
            <p className="text-smallTextPhone md:text-regularText text-justify">
            {countryData.countryWhyChoseSection.Description}
            </p>
          </div>
        <Image width={500} height={500} className="w-full md:w-[32.375vw] px-[3vw] md:px-0 h-auto" src={countryData.countryWhyChoseSection.ImageSrc} alt={countryData.countryWhyChoseSection.ImageAlt} />
      </div>

      {/* Country SpecificSection1 */}
      {countryData.countrySpecificSection1 && <Section1 id={id} />}

      {/* Country Cost Data */}
      <div className="flex flex-col mx-[6vw] md:mx-[12.5vw] gap-[2vw] mb-[10vw] md:mb-[8vw]">
        <h5 className="text-h5TextPhone md:text-h5Text text-center font-bold leading-[140%]">Cost Comparison</h5>
        <div className="flex overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse border border-black dark:border-borderGreyChosen ">
        <thead>
          <tr className="bg-linenChosen dark:text-black text-regularTextPhone md:text-mediumText text-center">
            <th className="min-w-[200px] md:min-w-0 border font-semibold border-black dark:border-r-black  dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Expense</th>
            <th className="min-w-[200px] md:min-w-0 border font-semibold border-black dark:border-r-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Russia</th>
            <th className="min-w-[200px] md:min-w-0 border font-semibold border-black  dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Indian Private College</th>
          </tr>
        </thead>
        <tbody className="text-smallTextPhone md:text-regularText"> 
          <tr>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Tuition (6 years)</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{countryData.countryCostData.countryTuitionFee}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{countryData.countryCostData.indiaTuitionFee}</td>
          </tr>
          <tr >
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Hostel & Food</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw]">{countryData.countryCostData.countryHotelFee}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw]">{countryData.countryCostData.indiaHotelFee}</td>
          </tr>
          <tr>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Total</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{countryData.countryCostData.countryTotal}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{countryData.countryCostData.indiaTotal}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <p className="text-center text-regularTextPhone md:text-h6Text">
  <span className="font-bold">{countryData.countryCostData.description.split(" ")[0]}</span>{" "}
  {countryData.countryCostData.description.split(" ").slice(1).join(" ")}</p>


        </div>
        
      {/* Country Specific Section 2 */}
      {countryData.countrySpecificSection2 && <Section2 id={id}  />}
      {countryData.countrySpecificSection3 && <Section3 id={id} data={countryData.countrySpecificSection3.data}/> }

      {/* Country Universiteis */}
      <Universities id={id} data={countryData.countryUniversities} countryName={countryData.countryName} />
      {/* {countryData.countrySpecificSection4 && <Section4 id={id}/>} */}

      {/* {countryData.countrySpecificSection5 && <Section5 id={id}/>} */}

      {/* Country Eligibilty Criteria  */}
      <EligibilityCriteria id={id} data={countryData.countryEligibilityStructure} countryName={countryData.countryName} />
      
      {/* Country Fee Structure */}
      <FeeStructure id={id} data={countryData.countryFeeStructure} /> 
      <PostArrival/>
      <CTASection/>
    </div>
    </>
  );
};

import countryNames  from '../../../lib/countryData';
import Section2 from "../../../components/studyDestinationComponents/section2";
import Section3 from "@/components/studyDestinationComponents/section3";
import FeeStructure from "@/components/studyDestinationComponents/feeStructure";
import EligibilityCriteria from "@/components/studyDestinationComponents/eligibilityCriteria";
import Universities from "@/components/studyDestinationComponents/universities";
import PostArrival from "@/components/studyDestinationComponents/postArrival";
import CTASection from "@/components/landingPage/CTASection";
import Section4 from "@/components/studyDestinationComponents/section4";
import Section5 from "@/components/studyDestinationComponents/section5";
import Head from "next/head";
// Server-Side Rendering (SSR)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const countryData = countryNames[id as keyof typeof countryNames];
  return {
    props: { id,countryData },
  };
};

export default NewPage;
