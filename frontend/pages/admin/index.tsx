import React, { useState,useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { isMobile } from 'react-device-detect';

const Admin = () => {

    const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Function to check viewport width
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Check width on component mount
    checkViewportWidth();

    // Add resize event listener
    window.addEventListener('resize', checkViewportWidth);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);
  
    

    const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
    return (
        <> 
        <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-lg w-full flex flex-col   p-8 rounded-lg ">
          <div className="mb-16">
          <p className="text-[40px] leading-[32px] font-bold text-center text-adminGreenChosen ">
            EDURIZON
          </p>
          </div>
          <form>
          <div className="mb-6">
            <label className="block text-[16px]  text-adminTextChosen">Username</label>
            <input
              type="text"
              placeholder="username"
              className="mt-[8px] text-[16px] w-full px-[16px] py-[12px] border border-adminBorderChosen rounded-[8px]  focus:border-adminBorderFocusedChosen focus:outline-none"
            />
          </div>
  
          <div className="mb-8 relative">
            <div className="flex justify-between items-center">
              <label className="block text-[16px] text-adminTextChosen">Password</label>
              {/* <a href="#" className="text-xs text-adminGreenChosen hover:underline">
                Forgot Password?
              </a> */}
            </div>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="w-full px-[16px] py-[12px] border border-adminBorderChosen rounded-[8px]  focus:border-adminBorderFocusedChosen focus:outline-none pr-10"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
          </div>
  
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="keep-signed-in"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="keep-signed-in" className="ml-2 text-sm text-gray-700">
              Keep me signed in
            </label>
          </div>
  
          <button className="w-full bg-teal-500 text-white py-[12px] rounded-[8px] text-[16px] font-semibold hover:bg-teal-600 transition">
            Login
          </button>
          </form>
        </div>
        
      </div>

      </>
    )
}

export default Admin;