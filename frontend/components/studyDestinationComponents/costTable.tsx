interface CostTableProps {
    id: string;
    data:{[key:string]:string};
}



const CostTable = ({ id,data }: CostTableProps) => {
    return (
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
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.countryTuitionFee}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.indiaTuitionFee}</td>
          </tr>
          <tr >
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Hostel & Food</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw]">{data.countryHotelFee}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw]">{data.indiaHotelFee}</td>
          </tr>
          <tr>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] font-semibold">Total</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.countryTotal}</td>
            <td className="border border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{data.indiaTotal}</td>
          </tr>
        </tbody>
      </table>
      </div>
        <p className="text-center text-regularTextPhone md:text-h6Text">
        <span className="font-bold">{data.description.split(" ")[0]}</span>{" "}
        {data.description.split(" ").slice(1).join(" ")}</p>


        </div>
        
    );
    }

export default CostTable;