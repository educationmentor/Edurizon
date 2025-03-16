"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image  from 'next/image';
import {motion} from 'framer-motion';
import EdurizonLogo from '../public/assets/Images/EdurizonLogo.svg'
import ApplyNowIcon from '../public/assets/Images/Icons/ApplyNowIcon.svg'
import { IconButton, TitleButton } from './Buttons';
import Link from 'next/link';
import { TransitionLink } from '@/utils/TransitionLink';
import ThemeToggle from './ThemeToggle';
import EdurizonFinalLogo from '../public/assets/Images/Icons/EdurizonFinalLogo.svg';
import MenuIcon from '../public/assets/Images/Icons/menuIcon.svg';

interface University {
  _id: string;
  name: string;
  country: string;
  type: string;
}

const Navbar = () => {
  console.log('Rendering Navbar component');
  const [hovered, setHovered] = useState(-1);
  const router = useRouter();
  const isMainPage = router.pathname === '/';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userType, setUserType] = useState<'user' | 'counselor' | null>(null);

  const studyDestinations = [
    "Russia",
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "New Zealand",
    "Singapore",
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
    <nav className={`${router.asPath=='/'?"absolute":'relative'} px-[2vw] md:px-[4.125vw] top-0 left-0 mt-[3vw] md:mt-[2vw] md:pb-[1.5vw] bg-transparent dark:bg-transparent w-full z-50`}>
      <div className='flex items-center font-poppins text-regularText text-black dark:text-white w-full  '>
      <div className="relative flex items-center text-smallText md:text-regularText justify-between w-full">
        <div className='md:w-[15.125vw] relative'>
          <Image src={EdurizonFinalLogo} alt="Edurizon Logo" className='w-[17.75vw] md:w-[5vw] h-[14vw] md:h-[3.875vw] '/>
          <div className="absolute top-[2vw] hidden dark:block  left-0 [filter:blur(1.7vw)] rounded-[50%] bg-paleOrangeChosen w-[5.375vw] h-[1vw]" />         
        </div>
        
        <button className='' >
          <TransitionLink href='/'>
            <motion.div  onHoverStart={()=>{setHovered(1)}} onHoverEnd={()=>setHovered(-1)} >Home  
            <div className={`border-t-[4px] border-orangeChosen    transition-all duration-500 ease-in-out rounded-xl ${hovered==1?"w-full":"w-0"} `}/>
            </motion.div>
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
        )}
        
        <IconButton 
          onClick={() => {}} 
          className='text-regularText md:text-smallText' 
          btnHeight={2.75} 
          btnWidth={9.0625} 
          btnRadius={6.25} 
          padding={0.375} 
          iconWidth={1.9125} 
          image={ApplyNowIcon} 
          btnTitle={"Apply Now"}
          btnHeightPhone={11} 
          btnWidthPhone={33.5} 
          btnRadiusPhone={15} 
          iconWidthPhone={8} 
          paddingPhone={3} 
        />
        <Image src={MenuIcon} alt='menuIcon' className='md:hidden w-[8vw] h-[8vw]'/>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;