import '../styles/globals.css';
import '../components/landingPage/faq.css'
import "../components/OtpLogin.css";
import '../components/EmblaCarousel/embla.css';
import '../components/landingPage/slider.css';
import "react-phone-input-2/lib/style.css"; //
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider } from '@/context/themeContext';
import axios from 'axios';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const counselorToken = localStorage.getItem('counselorToken');
        const currentPath = router.pathname;

        // Handle counselor routes
        if (currentPath.includes('/counselor/dashboard')) {
          if (!counselorToken) {
            router.push('/counselor/login');
          }
        }
        // Handle student routes
        else if (currentPath.includes('/dashboard')) {
          if (!userData) {
            router.push('/login');
          } else {
            // Verify token validity with backend
            try {
              const response = await axios.get('http://localhost:5001/api/auth/verify', {
                headers: {
                  Authorization: `Bearer ${JSON.parse(userData).token}`
                }
              });
              if (!response.data.valid) {
                localStorage.removeItem('user');
                router.push('/login');
              }
            } catch (error) {
              console.error('Token verification failed:', error);
              localStorage.removeItem('user');
              router.push('/login');
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  useEffect(() => {
    const checkViewportWidth = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewportWidth(); // Check on mount
    window.addEventListener('resize', checkViewportWidth); // Check on resize

    return () => window.removeEventListener('resize', checkViewportWidth); // Cleanup
  }, []);

  const excludedPaths = ['/login', '/admin', '/signup', '/counselor/dashboard', '/counselor/secret-register', '/counselor/secret-login']; // Paths to exclude Navbar & Footer
  const shouldExcludeLayout = excludedPaths.some((path) => router.pathname.includes(path));
  const isAdminRoute = router.pathname.includes('/');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      {/* Show the warning message on admin routes for mobile viewports */}
      {isAdminRoute && isMobileView ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-blue-200 mb-4">Coming Soon</h1>
            <p className="text-gray-700">
              This page can only be accessed from a desktop device. Please switch to a device with a larger screen (≥768px).
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Render Navbar & Footer unless excluded */}
          {!shouldExcludeLayout && <Navbar />}
          <Component {...pageProps} />
          {!shouldExcludeLayout && <Footer />}
        </>
      )}
    </ThemeProvider>
  );
}

export default MyApp;