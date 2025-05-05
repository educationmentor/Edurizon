
export default function CollegeTile({data,handleSubmit2}){
  
    return (
        <div className='grid grid-cols-3  gap-[1.5vw] px-[2vw] md:px-[4vw] mx-[4vw] md:mx-[8.5vw] pt-[1vw] pb-[2.5vw]'>
            
        {Object.entries(data).map(([key, value]) => (
          <div onClick={(e)=>{handleSubmit2(e,key)}} 
          className='grid hover:bg-gray-200 transition-colors duration-100  grid-cols-2 
          cursor-pointer bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,.7)]  gap-y-[.625vw] h-min py-[1.5vw] px-[1.5vw] text-regularTextPhone md:text-mediumText rounded-[.75vw]' key={key}>
            <div className='col-span-1 '>    
                <p className='font-semibold'>State Name:</p>
                <p className=" font-semibold">No. of Colleges:</p>
            </div>
            <div className='  col-span-1   overflow-hidden '>
                <p className=' text-ellipsis line-clamp-1 overflow-hidden text-right'>{key}</p>
                <p className="text-right">{data[key]}</p>
            </div>
          </div>
        ))}
      
        </div>
    )
}