
interface UnlistedTableProps {
    id: string;
    section2:string;
    content:{
        title:string;
        subTitle:string;
        data:string[][];
    };
}



const UnlistedTable = ({ id,content,section2="" }: UnlistedTableProps) => {
    const sections=["highlight"]
    const bool=sections.includes(section2);

    return (
        <div className="flex flex-col mx-[6vw] md:mx-[12.5vw] gap-[2vw] md:gap-[4vw] mb-[10vw] md:mb-[4vw]">
          <div className="flex flex-col gap-[1.5vw]">
          <h3 className="text-h5TextPhone md:text-h3Text font-bold text-center leading-[120%]">{content.title}</h3>
          <h5 className={`text-center text-regularTextPhone md:text-h5Text font-bold opacity-80 ${content.subTitle.length==0?"hidden":""}`}>{content.subTitle}</h5>
          </div>
          <div className="flex overflow-x-auto  no-scrollbar">
          <table className="w-full border-collapse border border-black dark:border-borderGreyChosen ">
            <thead>
              <tr className="bg-linenChosen dark:text-black text-regularTextPhone md:text-mediumText text-center">
                {content.data[0].map((highlight, index) => (
                  <th key={index} className="min-w-[200px] border font-semibold border-black dark:border-r-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] ">{highlight}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-smallTextPhone md:text-regularText align-top"> 
        
              {content.data.slice(1).map((row, i) => {
                const width=row.length;
                console.log(width);
                return(
                <tr key={i}>
                  {row.map((highlight, index) => (
                    <td key={index} className={`border dark:text-black dark:border-b-black dark:border-r-black border-black dark:border-borderGreyChosen px-[.75vw] py-[.625vw] w-[${100/width}%] ${index==0?"font-semibold":""} ${bool && index==0?"bg-linenChosen":""}`}>
                      {highlight}
                      </td>
                  ))}
                </tr>
                )
              })}
              
            </tbody>
          </table>
          </div>
        </div>
    );
    }

export default UnlistedTable;