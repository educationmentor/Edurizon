import React,{useState,useEffect} from 'react';
import rocket from '@/public/assets/Images/college-predictor/rocket.png'
import Switch from '@/public/assets/Images/college-predictor/Switch.svg'
import background from '@/public/assets/Images/college-predictor/background.png'
import axios from "axios";
import CollegeDetailDialouge from '@/components/college-predictor-components/CollegeDialougeBox';
import HoverToolkit from '@/components/college-predictor-components/HoverToolkit';
import CollegeTile from '@/components/college-predictor-components/CollegeTile';
import {states,rounds,amounts,roundMarksName,roundRankName,GovernmentSeats, ManagementSeatCategory} from '@/lib/college-predictor-data';
import Form1 from '@/components/college-predictor-components/Form1';
import { baseUrl } from '@/lib/baseUrl';
import Image from 'next/image';
import CollegePredictorForm from '@/components/CollgePredictorForm';

export default function CollgePredictor(){
    const [formData,setFormData]=useState({'marks':720,'category':'All','roundMark':'24MarkR1','roundRank':'24RankR1','amount':10000000,'rank':1});
    const [selectedState, setSelectedState] = useState(states[0]);
    const [rankorMarks, setRankorMarks] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedRound, setSelectedRound] = useState(rounds[0]);
    const [isHoveredRound,setIsHoveredRound]=useState(false);
    const [selectedAmount, setSelectedAmount] = useState(amounts[0]);
    const [isHoveredAmount,setIsHoveredAmount]=useState(false);
    const [data,setData]=useState([]);
    const [columnName, setColumnName] = useState({});
    const [isGovernment,setIsGovernment]=useState(false)
    const [isManagementCategory,setIsManagementCategory]=useState(false)
    const [wait,setWait]=useState(false);
    const [isOpen,setIsOpen]=useState(false);
    const [submitTrigger, setSubmitTrigger] = useState(false);
    const [selectedCollege,setSelectedCollege]=useState('');
    const [form1Appear,setForm1Appear]=useState(false);
    const [isVisible, setIsVisible] = useState(false); 
    const [details,setDetails]=useState(false);
    

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value,
        });
    }
    const handleChangeRound=(e)=>{
        if(e.target.value==='Round 1'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR1',
                'roundRank':'24RankR1',
            });
        }
        else if(e.target.value==='Round 2'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR2',
                'roundRank':'24RankR2',
            });
        }
        else if(e.target.value==='Round 3'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR3',
                'roundRank':'24RankR3',
            });
        }
        else{
            setFormData({
                ...formData,
                [e.target.id]:'All',
                'roundRank':'All',
            });
        }
    }

    const handleChangeAmount=(e)=>{
        if(e.target.value==='Round 1'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR1',
            });
        }
        else if(e.target.value==='Round 2'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR2',
            });
        }
        else if(e.target.value==='Round 3'){
            setFormData({
                ...formData,
                [e.target.id]:'24MarkR3',
            });
        }
        else{
            setFormData({
                ...formData,
                [e.target.id]:parseInt(e.target.value.replace(/,/g, ''), 10),
            });
        }
    }

    const handleIsGovernment=()=>{
        if(GovernmentSeats.includes(selectedState)){
            setIsGovernment(true);
        }
        else{
            setIsGovernment(false);
        }
        if(ManagementSeatCategory.includes(selectedState)){
            setIsManagementCategory(true);
        }else{
            setIsManagementCategory(false);
        }
    }
    
    
    const handleSubmit=async()=>{
        if(!details){
            setForm1Appear(true);
            return;
        }
        setWait(true);
        handleIsGovernment();
        setColumnName(formData);
        setIsVisible(true);
        if(rankorMarks){
            
        try{
            const res = await axios.post(`${baseUrl}/api/collegePredictor/retriveRanks`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData=await res.data;
            
            if(responseData.success===false){
                console.log(responseData);
                return;
            }
            setData(responseData);
            
        }catch(error){
            console.log(error);
        }}else{
            try{
                const res = await axios.post(`${baseUrl}/api/collegePredictor/retriveMarks`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const responseData=await res.data;
                
                if(responseData.success===false){
                    console.log(responseData);
                    return;
                }
                setData(responseData);
                
            }catch(error){
                console.log(error);
            }
        }
        setForm1Appear(false);
        // Trigger the animation
    setTimeout(() => {
      setIsVisible(false); // Reset animation after it completes (optional)
      setWait(false);
    }, 700);
        
        
    }

    const handleSubmit2=async(e,key)=>{
        console.log("key is", key)
        setFormData({
            ...formData,
            "category":key,
        });
        setSelectedState(key);
        handleFormSubmit();
    }
    
    const handleFormSubmit=()=>{
        // setSelectedState(formData['category']);
        console.log(formData['category']);
        console.log(selectedState);
        setSubmitTrigger(true);
        setSubmitTrigger(true);
        setForm1Appear(false);

    }

    const onClose=(e)=>{
       setForm1Appear(false);
    }

    useEffect(() => {
        if (details) {
            handleSubmit();
        }
    }, [details]); 

    const onSubmit=()=>{
    setDetails(true); 
    }
    const setDetailsFnc=(e)=>{
        setDetails(true);
    }
    useEffect(() => {
        if (submitTrigger) {
            handleSubmit();
            setSubmitTrigger(false);
        }
    
        const toggleScroll = (state) => {
            document.body.style.overflow = state ? "hidden" : "auto";
        };
        toggleScroll(isOpen);
    
        return () => toggleScroll(false);
    }, [submitTrigger, isOpen]);

    return(
        <div className=''>
        
        <section>
        <div  >

        {/* Header Section of this page */}
        <div className="relative  flex flex-col items-center z-[0] ">
            {/* Background Paper Image */}

            {/* Header Div above Image*/}
            <div className='reltaive z-[1] mt-[23vw] mb-[5vw] md:mb-[3vw] md:mt-[10vw] mx-[6vw] md:mx-[12.5vw]'>
            {/* Rocket Image */}
            <Image src={rocket} alt="background" className="absolute  md:top-[19vw] md:left-[11.5vw] hidden  md:block md:w-[12vw] h-auto pointer-events-none " />
            <div className='flex flex-col justify-center bg-paleOrangeChosen mx-auto mb-[8vw] md:mb-[1.75vw] text-black font-light text-tinyTextPhone md:text-tinyText h-[6vw] md:h-[1.75vw] w-[60vw] md:w-[10vw] text-center rounded-[2.75vw]'><p className=' px-[3vw] md:px-[1.5vw]'>College Predictor</p></div>
            <div className='w-[88vw] md:w-[58vw] mb-[4vw] md:mb-[3vw] mx-auto'>
              <h1 className="text-[8vw]  sm:text-h3TextPhone md:text-h2Text leading-[120%] dark:text-white text-center  font-bold ">Find The Best Fit<br className='md:hidden'/> College For You <br/><span className='text-orangeChosen'>Unlock Now!</span></h1>
          </div>
            <div className='shadow-[0px_0px_20px_0px_rgba(0,0,0,1)]   rounded-[6vw] md:rounded-[3vw]  '>
            <div className=" w-full py-[5vw]   md:py-[2vw] bg-white px-[4vw]  md:px-[3vw] gap-y-3 md:gap-y-0  grid grid-cols-2 md:grid-cols-4 rounded-t-[6vw] md:rounded-t-[3vw] ">

                {/* Marks */}
                <div className="flex flex-col justify-center items-center border-r-[1px]  border-[rgba(3,3,3,0.24)] col-span-1">
                <div className='select-none flex flex-row items-center gap-[2vw] md:gap-[.75vw] justify-around'>
                <h4 className='text-orangeChosen font-bold text-h5TextPhone md:text-h4Text text-center select-none'>{rankorMarks?"Rank":"Marks"}</h4>
                <Image onClick={()=>setRankorMarks(!rankorMarks)} src={Switch} className='cursor-pointer w-[5vw] md:w-[1.5vw] h-auto' alt='switch'/>
                </div>
                    {rankorMarks?<input onChange={handleChange} id="rank" className='w-[20vw] md:w-[13vw]   select-none text-center text-regularTextPhone md:text-h5Text focus:outline-none' type='number' value={formData['rank']} placeholder='Enter your Rank' ></input>
                    :<input onChange={handleChange} id="marks" className='w-[20vw] md:w-[13vw]  select-none text-center text-regularTextPhone md:text-h5Text focus:outline-none' type='number' value={formData['marks']} placeholder='Enter your marks' ></input>}
                </div>

                {/* State */}
                <div className="flex flex-col justify-center md:border-r-[1px]  border-[rgba(3,3,3,0.24)]   col-span-1">
                    <h4 className='text-orangeChosen font-bold text-h5TextPhone md:text-h4Text text-center select-none'>State</h4>
                    
                    <select  id="category" className="select-none max-w-[35vw] mx-auto md:w-[13vw] text-center text-regularTextPhone  md:text-h5Text  focus:outline-none bg-white  cursor-pointer"
                    onClick={()=>{setIsHoveredRound(false),setIsHoveredAmount(false) ,setIsHovered(!isHovered)}}
                    onChange={(e)=>{handleChange({target:{id:'category',value:e.target.value}}); 
                    setSelectedState(e.target.value);
                    handleIsGovernment();
                    setIsHoveredRound(false);
                    setIsHovered(false);}} value={selectedState|| 'Select a State'}>
                       {states.map((State, index) => (
                                <option key={index} value={State}
                                className=" p-[.75vw] md:w-[15vw] hover:bg-gray-200 cursor-pointer">
                                {State}
                                </option>
                            ))}
                       </select>        
                </div>

                {/* Round */}
                <div className="flex flex-col justify-center  border-r-[1px]  border-[rgba(3,3,3,0.24)]  col-span-1">
                    <h4 className='text-orangeChosen font-bold text-h5TextPhone md:text-h4Text text-center select-none'>Round</h4>  
                    <select id="round" className="select-none w-full text-center max-w-[35vw] mx-auto md:w-[13vw] text-regularTextPhone bg-white md:text-h5Text focus:outline-none  cursor-pointer" 
                     onClick={()=>{setIsHovered(false),setIsHoveredAmount(false),setIsHoveredRound(!isHoveredRound)}}
                    onChange={(e)=>{
                        handleChangeRound({target:{id:'roundMark',value:e.target.value}}); 
                        setSelectedRound(e.target.value);
                        setIsHovered(false);
                        setIsHoveredRound(false);
                    }}
                    value={selectedRound|| 'Select Round'}>
                        {rounds.map((Round, index) => (
                                <option
                                key={index} value={Round}
                                className="p-[.75vw] hover:bg-gray-200 cursor-pointer"
                                >
                                {Round}
                                </option>
                            ))}
                    </select>

                </div>

                {/* Amount */}
                <div className="flex flex-col justify-center items-center  border-[rgba(3,3,3,0.24)]  col-span-1">
                    <h4 className='text-orangeChosen font-bold text-h5TextPhone md:text-h4Text text-center pointer-events-none select-none  '>Amount</h4>
                    
                    <select id="amount" className="select-none w-full text-center  max-w-[35vw] mx-auto md:w-[15vw] text-regularTextPhone bg-white md:text-h5Text focus:outline-none  cursor-pointer"
                      onClick={()=>{setIsHovered(false),setIsHoveredRound(false),setIsHoveredAmount(!isHoveredAmount)}}
                        onChange={(e)=>{handleChangeAmount({target:{id:'amount',value:e.target.value}}); 
                        setSelectedAmount(e.target.value);
                        setIsHovered(false);
                        setIsHoveredRound(false);
                        setIsHoveredAmount(false);}}
                       value={selectedAmount|| 'Select Amount'}>
                       {amounts.map((Amount, index) => (
                                <option
                                key={index}
                                value={Amount}
                                className="p-[.75vw] hover:bg-gray-200 cursor-pointer"
                                >
                                {Amount}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Predit Button */}
            <div className="w-full py-[2vw] md:py-[1vw] flex flex-row items-center justify-center  bg-orangeChosen   rounded-b-[6vw] md:rounded-b-[3vw] ">
                <button onClick={handleSubmit} className='font-medium h-[10vw] md:h-[3vw] text-h5TextPhone md:text-h3Text flex justify-center items-center  mx-[2vw] text-white  rounded-full  w-full bg-orangeChosen text-center text-[rgba(43,105,176,1)]'>
                    {wait?
                    <div className="w-[8vw] h-[8vw] my-[1vw] md:w-[2.5vw] md:h-[2.5vw] md:my-[.5vw] border-[2px] md:border-4 border-white border-t-transparent  rounded-full animate-spin"/>:"Predict"}</button>
            </div>
            </div>
            </div>
            
        </div>
                

        {/* Custom dropdown menu */}
        {!wait&&        
        (columnName['category']!='All'?<>
       {data.length >0&&( 
       <div className=' pb-[4vw] overflow-y-visible'>
        <h2 className='underline text-h5TextPhone md:text-h3Text font-bold text-center pt-[1vw] pb-[2.5vw] select-none text-orangeChosen'>Your Result</h2>
        <div className='relative rounded-[1vw] py-[1vw] px-[1vw]  mx-[2vw] bg-white overflow-x-auto '>
        <table className='relative rounded-[1vw] overflow-x-scroll  mb-[5vw] table-auto border-collapse text-center w-full'>
            <thead className='border-b-[1px] overflow-x-scroll  border-spacing-[1vw]   border-black'>
                <tr className=' border-b-2 font-bold overflow-x-scroll leading-[140%] align-baseline  text-regularTextPhone md:text-regularText '>
                    <th className='w-[1vw] px-[.5vw]'>SNo.</th>
                    <th className=' w-[16vw] px-[.5vw] '>Institute Name</th>
                    <th className='w-[8vw] px-[.5vw]'>State</th>
                    <th className='w-[8vw] px-[.5vw]'>City</th>
                    <th className='w-[8vw] px-[.5vw]'>Category</th>
                    <th className='w-[8vw] px-[.5vw]'>{roundRankName[columnName['roundMark']]}</th>
                    <th className='w-[9vw] px-[.5vw]'>{roundMarksName[columnName['roundMark']]}</th>
                    <th className='w-[8vw] px-[.5vw]'>TutionFees</th>
                    <th className='w-[8vw] px-[.5vw]'>NRI Fees</th>
                    
                </tr>
            </thead>
            <tbody>
            {data.map((item,index) => (
           <tr
           key={index} onMouseEnter={() =>item[columnName["roundMark"]] === 165 } 
           onClick={() => {setIsOpen(true); setSelectedCollege(item);}}
           className="cursor-pointer hover:bg-gray-100 border-b-2 text-regularTextPhone md:text-regularText align-center  leading-[150%] relative transition-colors duration-200">
           <td className="py-4">{index + 1}</td>
           <td className='group text-left'>
             {item[columnName["roundMark"]] === 165 ? (
               <>{item["InstituteName"]}
                 <span className="text-red-700"> *</span>{  (
        <HoverToolkit />
      )} </>) : (
        item["InstituteName"])} </td>
           <td>{item["State"]}</td>
           <td>{item["City_District"]}</td>
           <td>{item["Category"]}</td>
           <td className='group '>
             {item[columnName["roundMark"]] === 165 ? (
               <>{item[columnName["roundRank"]]==0?"N/A":item[columnName["roundRank"]]}
                 <span className="text-red-700"> *</span>{  (
        <HoverToolkit />    
      )} </>) : (
               item[columnName["roundRank"]]==0?"N/A":item[columnName["roundRank"]] )} </td>
           <td className='group '>
             {item[columnName["roundMark"]] === 165 ? (
               <>{item[columnName["roundMark"]]}
                 <span className="text-red-700"> *</span>{  (
        <HoverToolkit />
      )} </>) : (
               item[columnName["roundMark"]]==0?"N/A":<>{item[columnName["roundMark"]]}</>)} </td>
           <td>{item["TutionFees"]=="N/A"?"N/A":<>₹ {item["TutionFees"]}</>}</td>
           <td>{item["NRIFees"]=="N/A"?"N/A":<>₹ {item["NRIFees"]}</>}</td>
         </tr>
         
            ))}
            </tbody>
        </table>
     
      
        </div>
        </div>)}</>:
        <>
         <>
         <div
        className={`transition-all duration-700 ease-in-out transform ${
          isVisible ? 'opacity-0 translate-y-0' : 'opacity-100 translate-y-5'
        }`}
      >
            <CollegeTile data={data} handleSubmit2={handleSubmit2}  />
        </div>
        
    </>
        </>)}
    
        </div>{form1Appear && (
            <CollegePredictorForm onClose={onClose} onSubmit={onSubmit} setDetailsFnc={setDetailsFnc}/>
        )}
        </section>
        
        
        {isOpen && (
        
        <div>
            <CollegeDetailDialouge
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            college={selectedCollege}
            isGovernment={isGovernment}
            isManagement={isManagementCategory}
            />
        </div>
)}

        
        </div>
    )
}




