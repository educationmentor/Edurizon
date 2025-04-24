import React,{useEffect, useState} from "react";
import {destinationData} from "@/lib/destinationData"
import SearchIcon from '@mui/icons-material/Search';
import ActionAreaCard from "@/components/studyDestinationComponents/studyDestinationCard";
import MenuIcon from '@mui/icons-material/Menu';
import { TextField, InputAdornment } from '@mui/material';
import { useRouter } from "next/router";

const categoriesMap: Record<string, string> = {viewAll:"View all", blog:"Blogs", Destination:"Study Destinations", University:"Top MBBS Universities", under20:"Under 20Lac", under40:"Budget 20Lac - 40Lac", under60:"Budget 40Lac - 60Lac"};
const categories = Object.keys(categoriesMap);
interface StudyDestinationsProps {
  categoryDefault: string;
}

const StudyDestinations = ({ categoryDefault="viewAll" }: StudyDestinationsProps) => {
    const router = useRouter();
    // useEffect(() => {
    //     setSelectedButton(0); // Select the first category by default
    // }, [categoryDefault]);
    categoryDefault = String(router.query.category)==="undefined"?categoryDefault:String(router.query.category);
    const [selectedButton, setSelectedButton] = useState(categories.indexOf(categoryDefault));

    const [selectedCategory, setSelectedCategory] = useState<string>(categoryDefault);
    console.log(selectedCategory);
    const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
    };
    console.log(categoryDefault);
    const [searchTerm, setSearchTerm] = useState("");

  
    // Filter blogs based on the selected category
    const filteredBlogs = selectedCategory === "viewAll"
  ? destinationData.filter(destination => destination.title.toLowerCase().includes(searchTerm.toLowerCase()))
  : destinationData.filter(destination => 
      destination.category === selectedCategory && 
      destination.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
    return (
        <div className="mx-[12px] sm:mx-[16px] md:mx-[32px] lg:mx-[64px] my-[60px] lg:my-[80px] xl:my-[120px]">
            <span className="flex justify-center  font-semibold text-[16px] md:text-[18px] lg:text-[20px] "
        //  style={{ fontSize: innerWidth>768?`${0.00476*innerWidth+6.8608}px`:`${0.00763*innerWidth+6.146}px` }}
         >Blog</span>
        <h2 className='mt-[8px]  lg:mt-[8px] text-buttonpurple  mb-[8px] md:mb-[16px]   flex justify-center font-bold text-[24px] md:text-[56px]' 
        // style={{ fontSize: innerWidth>768?`${0.0251*innerWidth+6.49}px`:`${0.04071*innerWidth+12.71}px` }}
        >Study Destinations</h2>
        <span className='flex justify-center text-[12px] md:text-[18px]' 
        // style={{ fontSize: `${0.00335*innerWidth+11.56}px` }}
        >The only place you need to craft your career choices.  </span>
        
        <div className="my-[20px] md:my-[30px] lg:my-[30px] xl:my-[40px] flex justify-center mx-auto  relative max-w-[320px] sm:max-w-[480px] md:max-w-[600px] lg:max-w-[720px]" >
          <div className="relative  border-none items-center  font-normal w-full ">
            <TextField variant='standard' placeholder="Search" type='text' id='search' value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
              className='input w-full justify-center px-[8px] pr-[8px] md:px-5 md:pr-12 border-none leading-[24px] text-[12px] md:text-[16px] h-[44px] md:h-[56px]  text-searchBarPurpleIcon bg-paleOrangeChosen rounded-full '
                InputProps={{
                  startAdornment: ( <InputAdornment className='px-[20px] md:px-[30px] w-[15px] md:w-[20px] h-auto ' position="start"> <MenuIcon  /> </InputAdornment> ),
                  endAdornment: ( <InputAdornment className='pr-[40px] md:pr-[50px] w-[15px] md:w-[20px] h-auto '   position="end"> <SearchIcon /> </InputAdornment> ), disableUnderline: true,}}/>
          </div>  
        </div>
        <section className="mb-[16px] md:mb-[32px] mx-[-12px] sm:mx-[-16px] md:mx-[0px] lg:mb-[32px] xl:mb-[48px] overflow-x-auto whitespace-nowrap md:overflow-x-visible md:whitespace-normal md:flex justify-center md:flex-row gap-[8px] md:gap-[20px] lg:gap-[24px] flex-wrap">
      {categories.map((name, index) => (
        <div
          key={index}
          onClick={() => handleCategoryChange(name)}
          className={`inline-flex border-dotted border-2 mx-[4px] md:mx-0 ${
            selectedButton === index ? 'border-none' : 'border-orangeChosen'
          } rounded-[32px] items-center justify-center relative leading-[150%]`}
        >
          <button
            className={`text-black dark:text-white  min-w-[82px] text-[12px]  md:text-[1rem] leading-tight  rounded-[32px]   ${
              selectedButton === index ? 'bg-orangeChosen text-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] py-[9px] px-[18px]' : 'dark:bg-black bg-white py-[8px] px-[16px]'
            }`}
            onClick={() => setSelectedButton(index)}
          >
            {categoriesMap[name]}
          </button>
        </div>
      ))}
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 md:max-w-[1312px] max-w-[616px]  grid-flow-row justify-center mx-auto gap-[16px] md:gap-[16px] lg:gap-[24px] xl:gap-[32px] ">
      {filteredBlogs.map((blog, index) => (
        <div   key={index}>
           <ActionAreaCard href={blog.href} image={blog.image} title={blog.title} category={blog.category}
      description= {blog.description}/>

        </div>
      ))}
    </div>


        </div>



    )
}

export default StudyDestinations;