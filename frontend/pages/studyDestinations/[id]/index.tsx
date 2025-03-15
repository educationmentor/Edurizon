import Breadcrumbs from "@/components/Breadcumbs";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Section1 from "./SpecifcSections/section1";
interface NewPageProps {
  id: string;
  countryData:  { 
    countryName: string;
    countryDescription:string;
    countryWhyChoseSection:{ [key: string]: string}
    countrySpecificSection1:boolean;
    countryCostData:{[key:string]:string};
    countrySpecificSection2:{data:string};
    countryUniversities:{
      universityName:string;
      location:string;
      annualFees:string;
      gloablRanking:string;
      highlights:string[];
    }[];
    countryFeeStructure:{[key:string]:string};
    countryEligibilityStructure:{[key:string]:string[]};
   };
}


const NewPage = ({ id,countryData }: NewPageProps) => {
  
  return (
    <div className=" justify-center w-[75vw] mx-auto">

      {/* Header Part */}
      <div id='header' className="flex flex-col items-center py-[7vw] gap-[1vw]">
        <Breadcrumbs />
        <h1 className=" mb-[4vw] text-h1Text font-bold text-center leading-[120%]">Study MBBS In { countryData.countryName }<br/>2025-26</h1>
        <p className="text-regularText">
        {countryData.countryDescription}
        </p>
      </div>

      {/* Description Part */}
      <div id='description' className="flex gap-[5vw] w-full mb-[4vw]">
          <div className="w-[37.625vw] flex flex-col gap-[2vw] my-auto">
            <h3 className="text-h3Text font-bold leading-[120%]">Why Should You Choose to Study <span className="text-orangeChosen">MBBS in {countryData.countryName}</span>?</h3>
            <p className="text-regularText text-justify">
            {countryData.countryWhyChoseSection.Description}
            </p>
          </div>
        <Image width={500} height={500} className="w-[32.375vw] h-auto" src={countryData.countryWhyChoseSection.ImageSrc} alt={countryData.countryWhyChoseSection.ImageAlt} />
      </div>

      {/* Country SpecificSection1 */}
      {countryData.countrySpecificSection1 && <Section1 id={id} />}

      {/* Country Cost Data */}
      <div className="flex flex-col gap-[2vw] mb-[8vw]">
        <h5 className="text-h5Text text-center font-bold leading-[140%]">Cost Comparison</h5>
        <table className="w-full border-collapse border border-black dark:border-white ">
        <thead>
          <tr className="bg-linenChosen dark:text-black text-mediumText text-center">
            <th className="border font-semibold border-black dark:border-r-black  dark:border-white px-[.75vw] py-[.625vw] ">Expense</th>
            <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Russia</th>
            <th className="border font-semibold border-black  dark:border-white px-[.75vw] py-[.625vw] ">Indian Private College</th>
          </tr>
        </thead>
        <tbody className="text-regularText"> 
          <tr>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Tuition (6 years)</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryCostData.countryTuitionFee}</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryCostData.indiaTuitionFee}</td>
          </tr>
          <tr >
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Hostel & Food</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw]">{countryData.countryCostData.countryHotelFee}</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw]">{countryData.countryCostData.indiaHotelFee}</td>
          </tr>
          <tr>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Total</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryCostData.countryTotal}</td>
            <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryCostData.indiaTotal}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-center text-h6Text">
  <span className="font-bold">{countryData.countryCostData.description.split(" ")[0]}</span>{" "}
  {countryData.countryCostData.description.split(" ").slice(1).join(" ")}</p>


        </div>
        
      {/* Country Specific Section 2 */}
      {countryData.countrySpecificSection2 && <Section2 id={id} data={countryData.countrySpecificSection2.data} />}


      {/* Country Universiteis */}
        <div id='universities in country' className="flex flex-col mb-[8vw] gap-[4vw]">
          <h3 className="text-center text-h3Text font-bold leading-[120%]">{countryData.countryName}'s Leading Medical Universities for<br/>Indian Students</h3>
          <table className="w-full border-collapse border border-black dark:border-white ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-mediumText text-center">
                <th className="border font-semibold border-black dark:border-r-black  dark:border-white px-[.75vw] py-[.625vw] ">University</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Location</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Annual Fee (INR)</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Global Ranking</th>
                <th className="border font-semibold border-black  dark:border-white px-[.75vw] py-[.625vw] ">Key Highlights</th>
              </tr>
            </thead>
            <tbody className="text-regularText align-top"> 
            {countryData.countryUniversities.map((university, i) => (
              <tr key={i}>
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">{university.universityName}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{university.location}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{university.annualFees}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{university.gloablRanking}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">
                {university.highlights.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
            ))}          
            </tbody>
          </table>
      </div>

      {/* Country Eligibilty Criteria  */}
        <div className="flex flex-col gap-[4vw] mb-[8vw]">
          <div className="flex flex-col gap-[1.5vw]">
          <h3 className="text-h3Text font-bold text-center leading-[120%]">Eligibility Criteria</h3>
          <h5 className="text-center text-h5Text font-bold opacity-80]">Are You Eligible to Study MBBS in Russia?</h5>
          </div>
          <table className="w-full border-collapse border border-black dark:border-white ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-mediumText text-center">
                <th className="border font-semibold border-black dark:border-r-black  dark:border-white px-[.75vw] py-[.625vw] ">Criteria</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Details</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Notes</th>
                
              </tr>
            </thead>
            <tbody className="text-regularText align-top"> 
            <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Academic Qualification</td>

                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.academicDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.academicNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">NEET Qualification</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.neetDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.neetNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Age Limit</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.ageDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.ageNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Required Documents</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.documentDetail.map((highlight, index) => (
                  <li className="list-decimal " key={index}> {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] w-1/3">
                {countryData.countryEligibilityStructure.documentNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      

      {/* Country Fee Structure  */}
      <div className="flex flex-col gap-[4vw] mb-[8vw]">
          <div className="flex flex-col gap-[1.5vw]">
          <h3 className="text-h3Text font-bold text-center leading-[120%]">Fee Structure</h3>
          <h5 className="text-center text-h5Text font-bold opacity-80]">MBBS in Russia 2025-26: Detailed Cost Breakdown</h5>
          </div>
          <table className="w-full border-collapse border border-black dark:border-white ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-mediumText text-center">
                <th className="border font-semibold border-black dark:border-r-black  dark:border-white px-[.75vw] py-[.625vw] ">Expense</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Annual Cost(INR)</th>
                <th className="border font-semibold border-black dark:border-r-black dark:border-white px-[.75vw] py-[.625vw] ">Details</th>
              </tr>
            </thead>
            <tbody className="text-regularText align-top"> 
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Tution Fees</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.tuitionCost}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.tuitionDetail}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Hostel & Food</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.hostelCost}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.hostelDetail}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Medical Insurance</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.medicalCost}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.medicalDetail}</td>
              </tr>
              <tr >
                <td className="border bg-linenChosen border-black dark:border-white px-[.75vw] py-[.625vw] font-semibold">Miscellaneous</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure.miscellaneousCost}</td>
                <td className="border border-black dark:border-white px-[.75vw] py-[.625vw] ">{countryData.countryFeeStructure. Detail}</td>
              </tr>
            </tbody>
          </table>
        </div>
      
    </div>
  );
};

import { countryNames } from './countryData';
import Section2 from "./SpecifcSections/section2";
// Server-Side Rendering (SSR)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const countryData = countryNames[id as keyof typeof countryNames];
  return {
    props: { id,countryData },
  };
};

export default NewPage;
