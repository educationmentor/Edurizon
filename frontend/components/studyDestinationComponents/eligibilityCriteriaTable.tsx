
interface EligibilityCriteriaProps {
    id: string;
    countryName:string;
    data:{[key:string]:string[]};
}



const EligibilityCriteria = ({ id,data,countryName }: EligibilityCriteriaProps) => {
    return (
        <div className="flex flex-col mx-[6vw] md:mx-[12.5vw] gap-[2vw] md:gap-[4vw] mb-[10vw] md:mb-[8vw]">
          <div className="flex flex-col gap-[1.5vw]">
          <h3 className="text-h5TextPhone md:text-h3Text font-bold text-center leading-[120%]">Eligibility Criteria</h3>
          <h5 className="text-center text-regularTextPhone md:text-h5Text font-bold opacity-80]">Are You Eligible to Study MBBS in {countryName}?</h5>
          </div>
          <div className="flex overflow-x-auto  no-scrollbar">
          <table className="w-full border-collapse border border-black dark:border-borderGreyChosen ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-regularTextPhone md:text-mediumText text-center">
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-b-black   dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Criteria</th>
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Details</th>
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Notes</th>
                
              </tr>
            </thead>
            <tbody className="text-smallTextPhone md:text-regularText align-top"> 
              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Academic Qualification</td>

                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.academicDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.academicNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>

              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">NEET Qualification</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.neetDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.neetNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>

              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Age Limit</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.ageDetail.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.ageNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>

              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Required Documents</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.documentDetail.map((highlight, index) => (
                  <li className="list-decimal " key={index}> {highlight}</li>
                ))}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-1/3">
                {data.documentNote.map((highlight, index) => (
                  <li className=" list-none " key={index}>- {highlight}</li>
                ))}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
    );
    }

export default EligibilityCriteria;