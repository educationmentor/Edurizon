import PhoneInput from 'react-phone-input-2';
import React, { FormEvent, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { TransitionLink } from '@/utils/TransitionLink';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    withCredentials: true
});

interface OtpLoginProps {
    isRegistration?: boolean;
    name?: string;
    email?: string;
}

const OtpLogin: React.FC<OtpLoginProps> = ({ isRegistration = false, name = '', email = '' }) => {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const darkModeCheck = () => {
                setIsDarkMode(document.documentElement.classList.contains('dark'));
            };
            darkModeCheck();
            const observer = new MutationObserver(darkModeCheck);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });
            return () => observer.disconnect();
        }
    }, []);

    // Start resend timer
    const startResendTimer = () => {
        setResendTimer(30);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const validatePhone = (phone: string) => {
        return phone.length >= 10;
    };

    const validateOtp = (otp: string) => {
        return /^\d{6}$/.test(otp);
    };

    const handleError = (error: any) => {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.status === 404) {
                if (isRegistration) {
                    setErrorMessage('This phone number is already registered. Please login instead.');
                } else {
                    setErrorMessage('No user found with this phone number. Please register first.');
                }
            } else if (axiosError.response?.status === 400) {
                setErrorMessage(axiosError.response.data?.message || 'Invalid request. Please check your details.');
            } else if (axiosError.response?.status === 429) {
                setErrorMessage('Too many attempts. Please try again later.');
            } else {
                setErrorMessage('Server error. Please try again later.');
            }
        } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    const sendOtp = async (e?: React.MouseEvent) => {
        e?.preventDefault();
        setErrorMessage(''); // Clear any previous errors
        setDevOtp(''); // Clear any previous dev OTP
        
        // Validate phone
        if (!validatePhone(phone)) {
            setErrorMessage('Please enter a valid phone number (at least 10 digits)');
            return;
        }

        // Validate registration fields
        if (isRegistration) {
            if (!name?.trim()) {
                setErrorMessage('Please enter your name');
                return;
            }
            if (!email?.trim()) {
                setErrorMessage('Please enter your email');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setErrorMessage('Please enter a valid email address');
                return;
            }
        }

        try {
            setIsLoading(true);
            const response = await api.post('/api/users/send-otp', { 
                phone: phone.toString(),
                isRegistration,
                ...(isRegistration && { name, email })
            });
            
            if (response.data.status === "success") {
                setOtpSent(true);
                setErrorMessage(''); // Clear any previous errors
                if (response.data.otp) {
                    setDevOtp(`Dev OTP: ${response.data.otp}`);
                }
                startResendTimer();
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (e?: React.MouseEvent) => {
        e?.preventDefault();
        setErrorMessage(''); // Clear any previous errors
        setDevOtp(''); // Clear dev OTP when verifying

        // Validate OTP
        if (!validateOtp(otp)) {
            setErrorMessage('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post('/api/users/verify-otp', { 
                phone: phone.toString(),
                otp: otp.toString(),
                isRegistration,
                ...(isRegistration && { 
                    userData: {
                        name,
                        email,
                        username: email.split('@')[0],
                        password: phone.toString(),
                        role: 'student'
                    }
                })
            });
            
            if (response.data.status === "success") {
                // Store user data and token separately for clearer access
                const userData = {
                    ...response.data.user,
                    token: `Bearer ${response.data.token}` // Add Bearer prefix when storing
                };
                localStorage.setItem('user', JSON.stringify(userData));
                toast.success('Login successful! Redirecting...');
                
                const userRole = response.data.user?.role || 'student';
                setTimeout(() => {
                    if (userRole === 'counselor') {
                        router.push('/counselor/dashboard');
                    } else if (userRole === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/'); // Redirect to home page for students
                    }
                }, 1000);
            }
        } catch (error) {
            handleError(error);
                        // Around line 180-200 in verifyOtp function:
            if (axios.isAxiosError(error) && error.response?.data?.alreadyVerified) {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    const userRole = user.role || 'student';
                    if (userRole === 'counselor') {
                        router.push('/counselor/dashboard');
                    } else if (userRole === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/studentDashboard'); // Changed from '/' to '/studentDashboard'
                    }
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-[1.5vw]'>
            <PhoneInput
                country={"in"}
                value={phone}
                onChange={(value) => {
                    setPhone(value);
                    setErrorMessage(''); // Clear error when phone number changes
                }}
                containerStyle={{ width: "100%", maxWidth: "30vw" }}
                inputStyle={{
                    width: "100%",
                    height: "3vw",
                    fontSize: "clamp(12px, 1vw, 18px)",
                    fontFamily: "poppins",
                    borderRadius: "3.125vw",
                    paddingLeft: "5vw",
                    backgroundColor: "transparent",
                    color: isDarkMode ? 'white' : 'black',
                    border: `1px solid ${isDarkMode ? 'white' : 'dimgray'}`,
                }}
                buttonStyle={{
                    width: "15%",
                    height: "3vw",
                    fontSize: "clamp(12px, 1vw, 18px)",
                    fontFamily: "poppins",
                    borderRadius: "3.125vw",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "default",
                }}
                dropdownStyle={{
                    backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                    color: isDarkMode ? 'white' : 'black',
                }}
                disabled={isLoading}
            />
            {otpSent && (
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                        setOtp(e.target.value);
                        setErrorMessage(''); // Only clear error message, not dev OTP
                    }}
                    className='w-[30vw] h-[3vw] font-poppins text-regularText text-black dark:text-white rounded-[6.25vw] border border-dimgrayChosen dark:border-white focus:outline-none px-[1.5vw] bg-transparent placeholder:text-dimgrayChosen dark:placeholder:text-gray-400'
                    disabled={isLoading}
                />
            )}
            <button
                onClick={otpSent ? verifyOtp : sendOtp}
                disabled={isLoading}
                className={`w-[30vw] h-[3vw] font-poppins text-regularText text-white rounded-[6.25vw] ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orangeChosen hover:bg-orange-600'}`}
            >
                {isLoading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
            </button>
            
            {/* Error and Dev OTP messages */}
            {errorMessage && (
                <p className="text-sm text-red-500 text-center">
                    {errorMessage}
                </p>
            )}
            {devOtp && (
                <p className="text-sm text-green-500 text-center">
                    {devOtp}
                </p>
            )}
            
            {otpSent && resendTimer > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Resend OTP in {resendTimer} seconds
                </p>
            )}
            {otpSent && resendTimer === 0 && (
                <button
                    onClick={sendOtp}
                    disabled={isLoading}
                    className="text-sm text-orangeChosen hover:text-orange-600 text-center"
                >
                    Resend OTP
                </button>
            )}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={isDarkMode ? "dark" : "light"}
            />
        </div>
    );
};

export default OtpLogin;
