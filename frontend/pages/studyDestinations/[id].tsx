import { GetServerSideProps } from "next";
interface NewPageProps {
  id: string;
  countryData:  { 
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    metaCanonical: string;
    countryName: string;
    countryDescription:string;
    countryTitle1:string;
    countryTitle2:string;
    countryWhyChoseSection:{
      title1normal:string;
      title1orange:string;
      title2:string;
      Description1:string[];
      Description2:string[];
      ImageSrc:string;
      ImageAlt:string;
    }
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
    whyChoseUniversity:{title:string;content:string[][];imageURL:string};
    countryReasonsToStudySection:{[key:string]:string}[];
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
      <Header id={id} title1={countryData.countryTitle1} title2={countryData.countryTitle2??""} description={countryData.countryDescription} />


      {/* Description Part */}
      <DescriptionComponent id={id} title1normal={countryData.countryWhyChoseSection.title1normal} title1orange={countryData.countryWhyChoseSection.title1orange} title2={countryData.countryWhyChoseSection.title2} content1={countryData.countryWhyChoseSection.Description1} content2={countryData.countryWhyChoseSection.Description2} imageAlt={countryData.countryWhyChoseSection.ImageAlt} imageSrc={countryData.countryWhyChoseSection.ImageSrc} />

      {/* Country Reasons To Study Destination */}
      {countryData.countryReasonsToStudySection&& <ReasonsToStudy id={id} name={countryData.countryName} content={countryData.countryReasonsToStudySection} />}

      {/* Country Cost Data */}
      {countryData.countryCostData && <CostTable id={id} data={countryData.countryCostData} />}
      
      {/* Country Specific Section 2 */}
      {countryData.countrySpecificSection2 && <Section2 id={id}  />}

      {/* Country Specific Section 3 */}
      {countryData.countrySpecificSection3 && <Section3 id={id} data={countryData.countrySpecificSection3.data}/> }

      {/* Country Universiteis */}
      {countryData.countryUniversities && <Universities id={id} data={countryData.countryUniversities} countryName={countryData.countryName} />}

      {/* {countryData.countrySpecificSection4 && <Section4 id={id}/>} */}

      {countryData.whyChoseUniversity && <WhyChoseUniversity id={id} title={countryData.whyChoseUniversity.title} imageURL={countryData.whyChoseUniversity.imageURL} content={countryData.whyChoseUniversity.content}/>}

      {/* Country Eligibilty Criteria  */}
      {countryData.countryEligibilityStructure && <EligibilityCriteria id={id} data={countryData.countryEligibilityStructure} countryName={countryData.countryName} />}
      
      {/* Country Fee Structure */}
      {countryData.countryFeeStructure && <FeeStructure id={id} data={countryData.countryFeeStructure} /> }
      
      <PostArrival/>
      <CTASection/>
    </div>
    </>
  );
};

import Section2 from "../../components/studyDestinationComponents/section2";
import Section3 from "@/components/studyDestinationComponents/section3";
import FeeStructure from "@/components/studyDestinationComponents/feeStructureTable";
import EligibilityCriteria from "@/components/studyDestinationComponents/eligibilityCriteriaTable";
import Universities from "@/components/studyDestinationComponents/universitiesTable";
import PostArrival from "@/components/studyDestinationComponents/postArrival";
import CTASection from "@/components/landingPage/CTASection";
import Section4 from "@/components/studyDestinationComponents/section4";
import Header from "@/components/studyDestinationComponents/headerComponent";
import Head from "next/head";
import DescriptionComponent from "@/components/studyDestinationComponents/descriptionCompnent";
import ReasonsToStudy from "../../components/studyDestinationComponents/reasonsToStudy";
import CostTable from "@/components/studyDestinationComponents/costTable";
import WhyChoseUniversity from "@/components/studyDestinationComponents/whyChoseUniversity";
import countryNames  from '@/lib/countryData';
// Server-Side Rendering (SSR)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  console.log("Fetching data for:", id);
  const countryData = countryNames[id as keyof typeof countryNames];
  if (!countryData) {
    return <div>
      Why not found
      </div>
  }
  return {
    props: { id,countryData },
  };
};

export default NewPage;
