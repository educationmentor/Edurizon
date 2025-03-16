interface FeeStructureProps {
    id: string;
    data: {[key:string]:string};
}



const FeeStructure = ({ id,data }: FeeStructureProps) => {
    return (
        <div className="flex flex-col mx-[6vw] md:mx-[12.5vw] gap-[2vw] md:gap-[4vw] mb-[10vw] md:mb-[8vw]">
          <div className="flex flex-col gap-[1.5vw]">
          <h3 className="text-h3Text font-bold text-center leading-[120%]">Fee Structure</h3>
          <h5 className="text-center text-h5Text font-bold opacity-80]">MBBS in Russia 2025-26: Detailed Cost Breakdown</h5>
          </div>
          <div className="flex overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse border border-black dark:border-borderGreyChosen ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-regularTextPhone md:text-mediumText text-center">
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-b-black  dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Expense</th>
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black  dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Annual Cost(INR)</th>
                <th className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">Details</th>
              </tr>
            </thead>
            <tbody className="text-smallTextPhone md:text-regularText align-top"> 
              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Tution Fees</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.tuitionCost}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.tuitionDetail}</td>
              </tr>
              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Hostel & Food</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.hostelCost}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.hostelDetail}</td>
              </tr>
              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Medical Insurance</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.medicalCost}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.medicalDetail}</td>
              </tr>
              <tr >
                <td className="border dark:text-black dark:border-b-black dark:border-r-black bg-linenChosen border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Miscellaneous</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.miscellaneousCost}</td>
                <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.miscellaneousDetail}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
    );
    }

export default FeeStructure;