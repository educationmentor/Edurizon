import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LoginImg from '../public/assets/Images/loginImg.png';
import LoginImgDark from '../public/assets/Images/landingPage/whyChoseUsDark.png';
import OtpLogin from '../components/OtpLogin';
import { TransitionLink } from '../utils/TransitionLink';
import { setAuth } from '../utils/auth';

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect after a short delay to show the welcome message
      setTimeout(() => {
        if (parsedUser.role === 'counselor') {
          router.push('/counselor/dashboard');
        } else if (parsedUser.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/studentDashboard');
        }
      }, 2000);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orangeChosen"></div>
    </div>;
  }

  if (user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
          Welcome back, <span className="text-orangeChosen">{user.name}</span>!
        </h1>
        <p className="text-dimgrayChosen dark:text-gray-300 text-lg">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='h-screen w-full flex flex-row md:gap-[3.25vw] justify-between '>
        <div className='w-auto md:w-[33.125vw] flex flex-col gap-[4vw] mx-[6vw] md:mx-0 md:ml-[8.5vw] my-auto md:py-[3.375vw]'>
          <div className='flex flex-col gap-[3vw] md:gap-[1vw]'>
            <h3 className=' leading-[120%] text-h4TextPhone md:text-h3Text font-bold text-black dark:text-white'>
              Unlock Your Study Abroad Dream Get Expert <span className='text-orangeChosen'>Guidance Today!</span>
            </h3>
            <p className='text-mediumTextPhone md:text-mediumText  text-dimgrayChosen dark:text-gray-300 font-medium'>
              Want to start your abroad journey <span className='font-bold'>Lets Connect.</span>
            </p>
            <OtpLogin />
            <div className='flex md:w-[30vw] items-center'>
                          <div className='w-full h-min border-dimgrayLightChosen  border-[1px] border-solid' />
                          <span className='mx-[1vw] text-dimgrayChosen dark:text-gray-300 font-medium text-regularTextPhone md:text-regularText '>OR</span>
                          <div className='w-full h-min border-dimgrayLightChosen border-[1px] border-solid' />
                        </div>
                        <div className=' md:w-[30vw]'>
                          <p className='text-regularTextPhone md:text-regularText text-dimgrayChosen dark:text-gray-300 text-center'>
                            Don't have an account? <TransitionLink href='/signup'><span className='text-orangeChosen'>SignUp </span></TransitionLink> | <TransitionLink href='/'><span className='text-orangeChosen'>Home</span></TransitionLink>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='relative h-screen w-auto overflow-hidden hidden md:block'>
          <Image className='w-[53.5vw] h-[56.25vw] object-contain block dark:hidden' src={LoginImg} alt='loginImage' />
          <Image className='w-[53.5vw] h-screen hidden dark:block' src={LoginImgDark} alt='loginImage' />
        </div>
      </div>
    </div>
  );
};

export default Login;