
export default function Form1({handleFormSubmit,form1open,setForm1Open}) {
    const closeDialog = () => {
        setForm1Open(false);
      };
      const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    return (
        <div className="absoute z-[20] overflow-y-hidden inset-0 fixed bg-opacity-50 bg-gray-900 flex justify-center items-center">
            <div className='flex flex-col items-center gap-[2vw] bg-white w-[60%] rounded-[2vw] p-[2vw]'>
                <div className='relative flex flex-row gap-[1vw] justify-center items-center'>
                <h4 className='text-h4Text  font-bold text-center'>Fill your details to proceed</h4>
                <div onClick={closeDialog} className='cursor-pointer   '>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  width="1.5vw" height="1.5vw" 
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                        </div>
            
            
            
            </div>
            <form className=" w-[90%] flex flex-col gap-[1vw] justify-center font-roboto text-mediumText" onSubmit={handleFormSubmit}>
            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='name' type="text" placeholder="Name" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='phone' type="number" placeholder="Phone" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='state' type="text" placeholder="State" onChange={handleChange}/>
                            <input className='border-[1.5px] p-[.75vw] border-black w-full placeholder:text-[#505050]' id='city' type="text" placeholder="City" onChange={handleChange}/>
                            
            </form>
                <button onClick={handleFormSubmit} className='border p-[.75vw] h-[vw] rounded-[2vw] bg-black w-[20%] text-white'>Submit</button>
            </div>
        </div>
    )
}
