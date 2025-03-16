"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image  from 'next/image';
import {motion} from 'framer-motion';
import EdurizonLogo from '../public/assets/Images/EdurizonLogo.svg'
import ApplyNowIcon from '../public/assets/Images/Icons/ApplyNowIcon.svg'
import { IconButton, TitleButton } from './Buttons';
import { TransitionLink } from '@/utils/TransitionLink';

const Navbar = () => {
  console.log('Rendering Navbar component');
  const [hovered, setHovered] = useState(-1);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transitionEnd, setTransitionEnd] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  console.log(transitionEnd);
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Study Destinations", href: "/studyDestinations", dropdown: true , borderTop: true },
    { name: "College Predictor", href: "https://college-predictor-nine.vercel.app/", external: true },
    { name: "Budget Calculator", href: "#" },
    { name: "Services", href: "#" , borderTop: true },
    { name: "Testimonials", href: "#" },
  ];

  

  const studyDestinations = [
    {name:"Russia", href:"/studyDestinations/study-mbbs-in-russia"},
    {name:"China", href:"/studyDestinations/study-mbbs-in-china"},
    {name:"UK", href:"../#"},
    {name:"Canada", href:"../#"},
    {name:"Australia", href:"../#"},
    {name:"Germany", href:"../#"},
    {name:"France", href:"../#"},
    {name:"New Zealand", href:"../#"},
    {name:"Singapore", href:"../#"},
  ];

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
      router.asPath === "/" || router.asPath==="/#" ? "absolute" : "relative"
    } px-[2vw] md:px-[4.125vw] top-0 left-0 mt-[3vw] md:mt-[2vw] md:pb-[1.5vw] bg-transparent dark:bg-transparent w-full z-50`}
  >
    <div className="flex items-center  text-regularText text-black dark:text-white w-full">
      <div className="flex items-center justify-between w-full relative">
        <div className="relative md:w-[5vw]">
          <TransitionLink href="/">
        
          <Image 
          height={40} width={40}
            src="/assets/Images/Icons/EdurizonFinalLogo.svg"
            alt="Edurizon Logo"
            className="w-[17.75vw] md:w-[5vw] h-[14vw] md:h-[3.875vw]"
          />
          </TransitionLink>
        </button>

        <button>
          <TransitionLink key={"home"} href='aboutUs'>
            <motion.div  onHoverStart={()=>{setHovered(2)}} onHoverEnd={()=>setHovered(-1)} >
              About Us
              <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==2?"w-full":"w-0"} `}/>
            </motion.div>
          </TransitionLink>
        </button>

        <div
          className="relative"
          onMouseEnter={() => {
            setHovered(3);
            setDropdownVisible(true);
          }}
          onMouseLeave={() => {
            setHovered(-1);
            setDropdownVisible(false);
          }}
        >
          <button>
            <motion.div>
              Study Destinations
              <div className={`border-t-[4px] border-orangeChosen transition-all duration-500 ease-in-out rounded-xl ${hovered==3?"w-full":"w-0"} `}/>
            </motion.div>
          </button>

          {dropdownVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-2 w-48 dark:bg-black bg-white shadow-lg rounded-md border border-gray-300 z-50"
            >
              <ul className="py-2">
                {studyDestinations.map((destination, index) => (
                  <TransitionLink key={index} href={destination.toLowerCase()}>
                    <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all duration-300">
                      {destination}
                    </li>
                  </TransitionLink>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <button onClick={()=>{router.push("https://college-predictor-nine.vercel.app/")}}>
          <motion.div  onHoverStart={()=>{setHovered(4)}} onHoverEnd={()=>setHovered(-1)} >
            College Predictor
            <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==4?"w-full":"w-0"} `}/>
          </motion.div>
        </button>
        
        <button>
          <motion.div  onHoverStart={()=>{setHovered(5)}} onHoverEnd={()=>setHovered(-1)} >
            Budget Calculator
            <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==5?"w-full":"w-0"} `}/>
          </motion.div>
        </button>

        <button>
          <motion.div  onHoverStart={()=>{setHovered(6)}} onHoverEnd={()=>setHovered(-1)} >
            Services
            <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==6?"w-full":"w-0"} `}/>
          </motion.div>
        </button>

        <button>
          <motion.div  onHoverStart={()=>{setHovered(7)}} onHoverEnd={()=>setHovered(-1)} >
            Testimonials
            <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==7?"w-full":"w-0"} `}/>
          </motion.div>
        </button>

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
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-sm font-medium text-white bg-orangeChosen rounded-md hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          </div>

        {/* Action Buttons */}
        <div className="flex gap-[1vw] md:gap-[.5vw] items-center">
          <TransitionLink href="/login">
            <TitleButton className="md:block hidden" btnHeightPhone={0} btnRadiusPhone={0} btnWidthPhone={0} btnHeight={2.75} btnWidth={6.0625} btnRadius={6.25} btnTitle="Sign Up" />
          </TransitionLink>
          <IconButton
            onClick={() => {}}
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
            btnTitle="Apply Now"
          />
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
         <IconButton className='ml-auto text-smallTextPhone opacity-70  ' image='/assets/Images/Icons/ApplyNowIcon.svg' iconWidth={0} padding={0} btnWidth={0} btnTitle='Apply Now' btnRadius={0} btnRadiusPhone={15} btnHeight={0} iconWidthPhone={7.75} paddingPhone={1.75} btnWidthPhone={34} btnHeightPhone={11}/>
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
            <TitleButton  btnWidthPhone={76} btnHeight={0} btnHeightPhone={11} btnRadius={0} btnRadiusPhone={25} btnTitle='Sign Up' btnWidth={0}/>
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
