"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image  from 'next/image';
import {motion} from 'framer-motion';
import { IconButton, TitleButton } from './Buttons';
import { TransitionLink } from '@/utils/TransitionLink';

interface University {
  _id: string;
  name: string;
  country: string;
  type: string;
}

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userType, setUserType] = useState<'user' | 'counselor' | null>(null);

  const [hovered, setHovered] = useState(-1);
  const router = useRouter();
  const isMainPage = router.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transitionEnd, setTransitionEnd] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [studyDestinationHover, setStudyDestinationHover] = useState(0);
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Study Destinations", href: "/study-destinations?category=Destination", dropdown: true , borderTop: true },
    { name: "College Predictor", href: "https://college-predictor-nine.vercel.app/", external: true },
    // { name: "Budget Calculator", href: "#" },
    { name: "Services", href: "#" , borderTop: true },
    { name: "Testimonials", href: "#" },
  ];

  
  const studyDestinations1=[
    {name:"MBBS in India", href:"/study-destinations/study-mbbs-in-india",flag:"/assets/Images/country-flag/indian-flag.png"},
    {name:"MBBS in Russia", href:"/study-destinations/study-mbbs-in-russia",flag:"/assets/Images/country-flag/russia.png"},
    {name:"MBBS in Georgia", href:"/study-destinations/study-mbbs-in-georgia",flag:"/assets/Images/country-flag/georgia.png"},
    {name:"MBBS in Tajikistan", href:"/study-destinations/study-mbbs-in-tajikistan",flag:"/assets/Images/country-flag/tajikistan.png"},
    {name:"MBBS in China", href:"/study-destinations/study-mbbs-in-china",flag:"/assets/Images/country-flag/china.png"},
  ]
   const studyDestinations2=[
    {name:"MBBS in Bangladesh", href:"/study-destinations/study-mbbs-in-bangladesh",flag:"/assets/Images/country-flag/bangladesh.png"},
    {name:"MBBS in Kazakhstan", href:"/study-destinations/study-mbbs-in-kazakhstan",flag:"/assets/Images/country-flag/kazakhstan.png"},
    {name:"MBBS in Uzbekistan", href:"/study-destinations/study-mbbs-in-uzbekistan",flag:"/assets/Images/country-flag/uzbekistan.png"},
    {name:"MBBS in Nepal", href:"/study-destinations/study-mbbs-in-nepal",flag:"/assets/Images/country-flag/nepal.png"},
    // {name:"MBBS in Kyrgyzstan", href:"/study-destinations/study-mbbs-in-kyrgyzstan",flag:"/assets/Images/country-flag/kyrgyzstan.png"},
    {name:"MBBS in Ukraine", href:"/study-destinations/study-mbbs-in-ukraine",flag:"/assets/Images/country-flag/ukraine.png"},

   ]

   const studyDestinations3=[
    {name:"Study in Germany", href:"/study-destinations/study-in-germany",flag:"/assets/Images/country-flag/german.png"},
    {name:"Study in UK", href:"/study-destinations/study-in-uk",flag:"/assets/Images/country-flag/uk.png"},
    {name:"Study in Hungary", href:"/study-destinations/study-in-hungary",flag:"/assets/Images/country-flag/hungary.png"},
    {name:"Study in Australia", href:"/study-destinations/study-in-australia",flag:"/assets/Images/country-flag/australia.jpg"},
   ]


  const topUniversitites=[
    {name:"Bashkir Medical University",href:" /study-destinations/study-mbbs-in-russia/bashkir-medical-university",flag:"",},
    {name:"Immanuel Kant Baltic Federal University",href:"/study-destinations/study-mbbs-in-russia/immanuel-kant-baltic-federal-university",flag:"",},
    {name:"Kazan Federal University",href:"/study-destinations/study-mbbs-in-russia/kazan-federal-university",flag:"",},
    {name:"Xinjiang University",href:"/study-destinations/study-mbbs-in-china/xinjiang-university",flag:"",},
    {name: "Tajik Natioanl University", href: "/study-destinations/study-mbbs-in-tajikistan"},
    {name:"Zhejiang University",href:"/study-destinations/study-mbbs-in-china/zhejiang-university",flag:"",},
    {name:"Xiamen Univeristy",href:"/study-destinations/study-mbbs-in-china/southeast-university",flag:"",},
    {name:"Southeast University",href:"/study-destinations/study-mbbs-in-china/southeast-university",flag:"",},
    {name:"Nanjing Medical University",href:"/study-destinations/study-mbbs-in-china/nanjing-medical-university",flag:"",},
    {name:"Krasnoyarsk State Medical University",href:"/study-destinations/study-mbbs-in-russia/krasnoyarsk-state-medical-university",flag:"",},
    {name:"National Research Nuclear University, MEPhI",href:"/study-destinations/study-mbbs-in-russia/national-research-nuclear-university",flag:"",},
    {name:"North Western State Medical University",href:"/study-destinations/study-mbbs-in-russia/north-western-state-medical-university",flag:"",},
    {name:"Northern State Medical University",href:"/study-destinations/study-mbbs-in-russia/northern-state-medical-university",flag:"",},
    {name:"Orenburg Medical University",href:"/study-destinations/study-mbbs-in-russia/orenburg-medical-university",flag:"",},
    {name:"Tambov State University",href:"",flag:"/study-destinations/study-mbbs-in-russia/tambov-state-university",},
    {name:"Petrozavodsk State University",href:"/study-destinations/study-mbbs-in-russia/petrozavodsk-state-university",flag:"",},
    {name:"Ulyanovsk State University",href:"/study-destinations/study-mbbs-in-russia/ulyanovsk-state-university",flag:"",},
    {name:"Ural State Medical University",href:"/study-destinations/study-mbbs-in-russia/ural-state-medical-university",flag:"",},
   
  ]
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userData = localStorage.getItem('user');
        const counselorToken = localStorage.getItem('counselorToken');
        
        if (userData) {
          const user = JSON.parse(userData);
          setIsLoggedIn(true);
          // Get first name only
          const firstName = (user.user?.name || user.name || '').split(' ')[0];
          setUserName(firstName);
          setUserType('user');
        } else if (counselorToken) {
          const counselorData = localStorage.getItem('counselorData');
          const counselor = counselorData ? JSON.parse(counselorData) : {};
          setIsLoggedIn(true);
          setUserName(counselor.name || '');
          setUserType('counselor');
        } else {
          setIsLoggedIn(false);
          setUserType(null);
          setUserName('');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
      }
    };

    // Check auth status immediately
    checkAuthStatus();

    // Set up an interval to check auth status periodically
    const interval = setInterval(checkAuthStatus, 5000); // Check every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (userType === 'user') {
      localStorage.removeItem('user');
    } else if (userType === 'counselor') {
      localStorage.removeItem('counselorToken');
      localStorage.removeItem('counselorData');
    }
    setIsLoggedIn(false);
    setUserName('');
    setUserType(null);
    router.push('/');
  };


  return (
    <nav
className={`${
router.asPath === "/" || router.asPath==="/#" || router.asPath=="/college-predictor" ? "absolute" : "relative"
} px-[2vw] md:px-[4.125vw] top-0 left-0 mt-[3vw] md:mt-[2vw] text md:pb-[1.5vw] bg-transparent dark:bg-transparent w-full z-50`}
>
      <div className="flex items-center  text-regularText text-black dark:text-white w-full">
      <div className="flex items-center justify-between w-full ">
          <div className="relative md:w-[5vw]">
          <TransitionLink href="/">
        
          <Image 
          height={40} width={40}
            src="/assets/Images/Icons/EdurizonFinalLogo.svg"
            alt="Edurizon Logo"
            className="w-[17.75vw] md:w-[5vw] h-[14vw] md:h-[3.875vw]"
          />
          </TransitionLink>
        <div className="absolute top-[2vw]  hidden w-[5.375vw] dark:md:block left-0 [filter:blur(10vw)] md:[filter:blur(1.7vw)] rounded-[50%] bg-paleOrangeChosen md:h-[1vw]" />
        </div>

<div className='flex gap-[3vw] items-center'>
       {/* Main Navigation */}
       <div id="navbaritems" className="hidden md:flex gap-[1.5vw]">
            {menuItems.map((item, index) =>
              item.dropdown ? (
        <div
key={index}
          className=""
          onMouseEnter={() => {
            setHovered(index);
            setDropdownVisible(true);
          }}
          onMouseLeave={() => {
            setHovered(-1);
            setDropdownVisible(false);
          }}
        >
          <button key={index} onClick={() => setDropdownVisible(!dropdownVisible)} >
            <TransitionLink href={item.href}>
              
            <motion.div className='dark:text-white'>
              {item.name}
              <div
                className={`border-t-[4px]  border-orangeChosen transition-all duration-500 ease-in-out rounded-xl ${
                hovered === index ? "w-full" : "w-0"
                        }`}
                  />
            </motion.div>
            </TransitionLink>
          </button>
          {dropdownVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-[80vw] h-[21.125vw]  mx-[10vw] left-0 absolute  bg-transparent"
            >
              <div className='flex flex-row w-full mt-2 py-[2vw] px-[2vw] h-full dark:bg-black bg-white rounded-[.875vw] border-gray-300 z-50 shadow-lg border'>
                    <div className='text-regularText font-bold min-h-full w-[13vw]  flex flex-col  justify-between py-[3.5vw] border-r-[1px] border-black'>
                      <button onMouseEnter={()=>setStudyDestinationHover(0)}  className='text-left'>
                        <h6 className='' style={{color:studyDestinationHover==0?"#FF7500":""}}>
                        Top Study Destinations
                        </h6>
                      </button>
                      <button onMouseEnter={()=>setStudyDestinationHover(1)} style={{color:studyDestinationHover==1?"#FF7500":""}} className='text-left'>
                        <h6>
                        Top Medical College <br/>Country Wise
                        </h6>
                      </button>
                      <button onMouseEnter={()=>setStudyDestinationHover(0)}  className='text-left'>
                        <h6 style={{color:studyDestinationHover==2?"#FF7500":""}}>
                        Budget Wise University
                        </h6>
                      </button>
                  </div>
                  <div className='w-[60vw] ml-auto h-full '>
                    {studyDestinationHover==0?<ul className='ml-auto h-full  grid grid-cols-3 w-[60vw]  gap-y-[1vw] gap-x-[1.75vw]'>
                    <div className='flex flex-col h-full gap-[1vw]'>
                      {(
                        studyDestinations1.map((destination, i) => (
                          <div key={i} onClick={()=>setDropdownVisible(false)}>
                          <TransitionLink  href={destination.href}>
                            <li className="flex flex-row items-center gap-[1.125vw] hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  cursor-pointer transition-all duration-300">
                                <Image src={destination.flag} width={50} height={50} alt='flag' className={`shadow-xl rounded-full h-[2.5vw] w-[2.5vw] `}/>
                                <h5 className='text-mediumText font-bold'>
                                {destination.name}
                                </h5>
                            </li>
                          </TransitionLink>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='flex flex-col h-full gap-[1vw]'>
                      {(
                        studyDestinations2.map((destination, i) => (
                          <div key={i} onClick={()=>setDropdownVisible(false)}>
                          <TransitionLink  href={destination.href}>
                            <li className="flex flex-row items-center gap-[1.125vw] hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  cursor-pointer transition-all duration-300">
                                <Image src={destination.flag} width={50} height={50} alt='flag' className={`shadow-xl rounded-full h-[2.5vw] w-[2.5vw] `}/>
                                <h5 className='text-mediumText font-bold'>
                                {destination.name}
                                </h5>
                            </li>
                          </TransitionLink>
                          </div>
                        ))
                      )}
                    </div>
                    <div className='flex flex-col h-full gap-[1vw]'>
                      {(
                        studyDestinations3.map((destination, i) => (
                          <div key={i} onClick={()=>setDropdownVisible(false)}>
                          <TransitionLink  href={destination.href}>
                            <li className="flex flex-row items-center gap-[1.125vw] hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  cursor-pointer transition-all duration-300">
                                <Image src={destination.flag} width={50} height={50} alt='flag' className={`shadow-xl rounded-full h-[2.5vw] w-[2.5vw] `}/>
                                <h5 className='text-mediumText font-bold'>
                                {destination.name}
                                </h5>
                            </li>
                          </TransitionLink>
                          </div>
                        ))
                      )}
                    </div>

                    </ul>:
                      
                        studyDestinationHover==1?<ul className='ml-auto grid grid-cols-3 w-[60vw]  gap-y-[1vw] gap-x-[1.75vw]'>
                          {(
                        topUniversitites.map((destination, i) => (
                          <div key={i} onClick={()=>setDropdownVisible(false)}>
                          <TransitionLink  href={destination.href}>
                            <li className="flex flex-row items-center gap-[1.125vw] hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  cursor-pointer transition-all duration-300">
                                <h5 className='text-regularText font-bold'>
                                {destination.name}
                                </h5>
                            </li>
                          </TransitionLink>
                          </div>
                        ))
                      )}
                        </ul>
                      :<></>}
                      </div>
                  {/* <ul className="ml-auto w-[60vw] grid grid-cols-3 gap-y-[1vw] gap-x-[1.75vw]">
                    {(studyDestinationHover==1?(
                        topUniversitites.map((destination, i) => (
                          <div key={i} onClick={()=>setDropdownVisible(false)}>
                          <TransitionLink  href={destination.href}>
                            <li className="flex flex-row items-center gap-[1.125vw] hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white  cursor-pointer transition-all duration-300">
                                <h5 className='text-regularText font-bold'>
                                {destination.name}
                                </h5>
                            </li>
                          </TransitionLink>
                          </div>
                        ))
                      ):"") }
                      
                    </ul> */}

             
              </div>
            </motion.div>
          )}
        </div>
) : (
                <button key={index} onClick={() => item.external && router.push(item.href)}>
                  <TransitionLink href={item.external ? "#" : item.href}>
          <motion.div className='dark:text-white'
              onHoverStart={() => setHovered(index)}
              onHoverEnd={() => setHovered(-1)}
                                  >
                                    {item.name}
                          <div
              className={`border-t-[4px] border-orangeChosen transition-all duration-500 ease-in-out rounded-xl ${
                                        hovered === index ? "w-full" : "w-0"
                                      }`}
/>
              </motion.div>
                  </TransitionLink>
                  </button>
                )
              )}
                      </div>
                
{/* Action Buttons */}
        <div className="flex gap-[1vw] md:gap-[.5vw] items-center">

        {isLoggedIn ? (
            <div className="relative flex items-center gap-4">
              <button
                className="flex items-center gap-2 hover:text-orangeChosen transition-colors"
                onMouseEnter={() => setUserDropdownVisible(true)}
                onMouseLeave={() => setUserDropdownVisible(false)}
              >
                <span className="hidden md:block">Welcome, {userName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {userDropdownVisible && (
                  <div className="absolute right-0 mt-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    {userType === 'counselor' ? (
                      <button
                        onClick={() => router.push('/counselor/dashboard')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push('/studentDashboard')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </button>
            </div>):

          <TransitionLink href="/login">
            <TitleButton className="md:block hidden" btnHeightPhone={0} btnRadiusPhone={0} btnWidthPhone={0} btnHeight={2.75} btnWidth={6.0625} btnRadius={6.25} btnTitle="Login" />
          </TransitionLink>}
          
          <TransitionLink href="/signup">
          <IconButton onClick={() => {}} 
          className="text-smallTextPhone flex  md:hidden lg:flex md:text-smallText" 
          btnHeight={2.75} 
          btnWidth={9.0625} 
          btnRadius={6.25} 
          padding={0.375} 
          iconWidth={1.9125} 
          paddingPhone={1.5}
            iconWidthPhone={8}
          btnHeightPhone={11} 
                    btnRadiusPhone={15} 
          btnWidthPhone={36}
            image="/assets/Images/Icons/ApplyNowIcon.svg"
            btnTitle="Apply Now"/>
          </TransitionLink>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Image src="/assets/Images/Icons/menuIcon.svg" width="40" height="40" alt="menuIcon" className="md:hidden w-[8vw] h-[8vw]" />
          </button>
        </div>
        </div>
      </div>
    </div>
    <div className='md:hidden'>
    {isMenuOpen && (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-white dark:bg-black opacity-50 transition-opacity duration-300"
      onClick={() => (setIsMenuOpen(false), setTransitionEnd(false))} // Closes menu when clicking outside
    ></div>
  )}
    <div className={`fixed top-[14vw] w-[90vw] h-full px-[3vw] dark:text-black bg-[#f7f2fa] mt-[5vw] shadow-lg p-4 transition-all duration-300 transform ${
          isMenuOpen ? transitionEnd ? "right-0":"right-[2vw]" : "right-[-90vw]"}`} onTransitionEnd={() => isMenuOpen && setTimeout(() => setTransitionEnd(true), 10)} >
        <div className='flex justify-start gap-[3vw]'>
          <div className='ml-auto'>
        <TransitionLink href="/signup">
         <IconButton className='ml-auto text-smallTextPhone opacity-70  ' image='/assets/Images/Icons/ApplyNowIcon.svg' iconWidth={0} padding={0} btnWidth={0} btnTitle='Apply Now' btnRadius={0} btnRadiusPhone={15} btnHeight={0} iconWidthPhone={7.75} paddingPhone={1.75} btnWidthPhone={34} btnHeightPhone={11}/>
        </TransitionLink>
        </div>
        <button  className=" text-orangeChosen " onClick={() => (setIsMenuOpen(false),setTransitionEnd(false))}>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-[6vw] h-[6vw]' viewBox="0 0 24 24" fill="none" stroke='#FF7500' 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        </button>
        </div>
        
        <div className=' text-regularTextPhone'>
          {menuItems.map((item, index) => (
            
            <div key={index} className="mx-[4vw] py-[4vw] " style={item.borderTop ? {borderTop: '1.5px solid #cac4d0'} : {}}>
              <TransitionLink href={item.href} >
              <span onClick={() => setIsMenuOpen(false)}>{item.name}</span>
              </TransitionLink>
            </div>
          ))}
        </div>
          <div className='flex justify-center mt-[2vw]'>
            <TitleButton  btnWidthPhone={76} btnHeight={0} btnHeightPhone={11} btnRadius={0} btnRadiusPhone={25} btnTitle='Login' btnWidth={0}/>
          </div>
      </div>
      </div>

    </nav>
  );
};

export default Navbar;



  // const isMainPage = router.pathname === '/';
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [universities, setUniversities] = useState<University[]>([]);


  // interface University {
  //   _id: string;
  //   name: string;
  //   country: string;
  //   type: string;
  // }
  

// useEffect(() => {
  //   const fetchUniversities = async () => {
  //     const response = await axios.get('http://localhost:5000/api/universities/mbbs');
  //     setUniversities(response.data);
  //   };

  //   fetchUniversities();
  // }, []);

  // const handleUniversityClick = (id: string) => {
  //   setDropdownOpen(false); // Close the dropdown
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push(`/login?redirect=/university/${id}`);
  //   } else {
  //     router.push(`/university/${id}`);
  //   }
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   router.push('/login');
  // };



{/* <div className="relative">
          
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
          >
            MBBS
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded shadow-lg">
              {universities.length > 0 ? (
                universities.map((university) => (
                  <div
                    key={university._id}
                    className="px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-700"
                    onClick={() => handleUniversityClick(university._id)}
                  >
                    {university.name} ({university.country})
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-300">No universities available</div>
              )}
            </div>
          )}
        </div> */}
        
  
    {/* <button
          onClick={handleLogout}
          className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500"
        >
          Logout
        </button> */}