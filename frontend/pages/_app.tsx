import "../styles/globals.css";
import "../components/landingPage/faq.css";
import "../components/OtpLogin.css";
import "../components/EmblaCarousel/embla.css";
import "../components/landingPage/slider.css";
import "react-phone-input-2/lib/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { helvetica,poppins } from "../styles/fonts";
import { useEffect, useState, useMemo } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/themeContext";
import Head from "next/head";
import {GoogleAnalytics} from '@next/third-parties/google'
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";

// ✅ Load Navbar and Footer Only When Needed
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

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
              const response = await axios.get(`${baseUrl}/api/auth/verify`, {
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
  const isAdminRoute = useMemo(() => router.pathname.includes("/admin"), [router.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        {/* ✅ Preload Fonts & Critical Images */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Your Website Description Here" />
        <title>Edurizon Private Limited</title>
        
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <style>{`
        
        body {
          font-family: ${poppins.style.fontFamily}, sans-serif;
        }


         h1, h2, h3, h4, h5, h6 {
          font-family: ${helvetica.style.fontFamily}, sans-serif;
        }
        `}</style>
        
      </Head>

    <ThemeProvider>
      {isAdminRoute && isMobileView ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h1 className="text-2xl font-bold text-blue-500 mb-4">Coming Soon</h1>
            <p className="text-gray-700">
              This page can only be accessed from a desktop device. Please switch to a device with a larger screen (≥768px).
            </p>
          </div>
        </div>
      ) : (
        <>
          {!shouldExcludeLayout && <Navbar />}
          <Component {...pageProps} />
            <GoogleAnalytics gaId="G-Z25NZ103DJ"/>
            <div id='footer'>
            {!shouldExcludeLayout && <Footer />}</div>
        </>
      )}
    </ThemeProvider>
    </>
  );
}

export default MyApp;
