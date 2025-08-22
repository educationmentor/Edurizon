import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from "@/context/themeContext";
import Image from 'next/image';
import { useRouter } from 'next/router';
import OtpLogin from '../components/OtpLogin';
import { TransitionLink } from '../utils/TransitionLink';
import axios from 'axios';
import { baseUrl } from '@/lib/baseUrl';

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form,setForm] = useState({
    email: '',
    password: ''
  });
  const useTheme=()=>useContext(ThemeContext);
  const { theme } = useTheme();
  const imageSrc =
  theme == "dark"?
  "/assets/Images/auth/loginImgDark.webp":
  "/assets/Images/auth/loginImg.webp";
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

//   if (user) {
//     return (
//       <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
//         <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
//           Welcome back, <span className="text-orangeChosen">{user.name}</span>!
//         </h1>
//         <p className="text-dimgrayChosen dark:text-gray-300 text-lg">
//           Redirecting you to your dashboard...
//         </p>
//       </div>
//     );
//   }

  const handleSubmit  = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        const response = await axios.post(`${baseUrl}/api/`,form);
        console.log(response);
    }catch(error){
        console.log(error);
    }
  };

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
            <form onSubmit={handleSubmit} className='flex flex-col gap-[3vw] md:gap-[1vw]' >
            <input
              type="email"
              placeholder="Enter Email"
              value={form.email}
              className='w-full md:w-[30vw] h-[12vw] md:h-[3vw] text-regularTextPhone md:text-regularText text-black dark:text-white rounded-[12.5vw] md:rounded-[6.25vw] border border-dimgrayChosen dark:border-white focus:outline-none px-[5vw] md:px-[1.5vw] bg-transparent placeholder:text-dimgrayChosen dark:placeholder:text-gray-400'
              onChange={(e) => setForm({...form,email:e.target.value})}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={form.password}
              className='w-full md:w-[30vw] h-[12vw] md:h-[3vw] text-regularTextPhone md:text-regularText text-black dark:text-white rounded-[12.5vw] md:rounded-[6.25vw] border border-dimgrayChosen dark:border-white focus:outline-none px-[5vw] md:px-[1.5vw] bg-transparent placeholder:text-dimgrayChosen dark:placeholder:text-gray-400'
              onChange={(e) => setForm({...form,password:e.target.value})}
            />
            <button
                type='submit'
                disabled={isLoading}
                className={`md:w-[30vw] h-[12vw] md:h-[3vw]  text-regularTextPhone md:text-regularText text-white rounded-[12.5vw] md:rounded-[6.25vw] ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orangeChosen hover:bg-orange-600'}`}
            >
                {isLoading ? 'Please wait...' : 'Login'}
            </button>
            </form>
            <div className='flex md:w-[30vw] items-center'>
                          <div className='w-full h-min border-dimgrayLightChosen  border-[1px] border-solid' />
                          <span className='mx-[1vw] text-dimgrayChosen dark:text-gray-300 font-medium text-regularTextPhone md:text-regularText '>OR</span>
                          <div className='w-full h-min border-dimgrayLightChosen border-[1px] border-solid' />
                        </div>
                        <div className=' md:w-[30vw]'>
                          <p className='text-regularTextPhone md:text-regularText text-dimgrayChosen dark:text-gray-300 text-center'>
                            Don't have an account? <TransitionLink href='/signup'><span className='text-orangeChosen'>SignUp </span></TransitionLink>
                            | <TransitionLink href='/login'><span className='text-orangeChosen'>Login</span></TransitionLink>
                             | <TransitionLink href='/'><span className='text-orangeChosen'>Home</span></TransitionLink>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='relative md:flex items-center h-screen w-auto overflow-hidden hidden'>
                              <Image width={1000} height={1000} className='w-[53.5vw] h-[45.25vw] object-contain ' src={imageSrc} alt='Imgae' />
                            </div>
      </div>
    </div>
  );
};

export default Login;