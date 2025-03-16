interface Section4Props {
    id: string;
}



const Section4 = ({ id }: Section4Props) => {
    return (
        <div className=" flex flex-col items-center gap-[4vw] mx-[12.5vw]">
            <h3 className="text-h3Text text-center font-bold leading-[130%]">Key Highlights Comparison</h3>
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
            {/* {data.map((university, i) => (
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
            ))}           */}
            </tbody>
          </table>
        </div>
    );
    }

export default Section4;