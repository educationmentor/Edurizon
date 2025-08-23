import "../styles/globals.css";
import "../components/landingPage/faq.css";
import "../components/OtpLogin.css";
import "../components/EmblaCarousel/embla.css";
import "../components/landingPage/slider.css";
import "react-phone-input-2/lib/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/old.css";
import "@/styles/owl.carousel.min.css";
import { helvetica,poppins } from "../styles/fonts";
import { useEffect, useState, useMemo, useRef } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/themeContext";
import Head from "next/head";
import {GoogleAnalytics} from '@next/third-parties/google'
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import Script from "next/script";
import { IconButton } from "@/components/Buttons";
import ThemeToggle from "@/components/ThemeToggle";
import CTASection from "@/components/landingPage/CTASection";
import ConsultationForm from "@/components/ConsultationForm";
import { usePathname } from "next/navigation";
// import HeroSection from "@/components/landingPage/HeroSection";
import CTASectionComponent from "@/components/CTASectionComponent";
import Home from '../pages/index'
import NavHeader from "@/components/NavHeader";

const GA_TRACKING_ID = "G-Z25NZ103DJ";

// ✅ Load Navbar and Footer Only When Needed
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const freeConsultationRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const counselorToken = localStorage.getItem('counselorToken');
        const currentPath = router.pathname;

        if (currentPath.includes('/counselor/dashboard')) {
          if (!counselorToken) {
            router.push('/counselor/login');
          }
        } else if (currentPath.includes('/dashboard')) {
          if (!userData) {
            router.push('/login');
          } else {
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

    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);

  const excludedPaths = [
    '/login',
    '/admin',
    '/signup',
    '/counselor/dashboard',
    '/counselor/secret-register',
    '/counselor/secret-login',
    '/registered-student-login'
  ];
  const shouldExcludeLayout = excludedPaths.some(path => router.pathname.includes(path));
  const isAdminRoute = useMemo(() => router.pathname.includes('/admin'), [router.pathname]);

  return (
    <>
      <Head>
        {/* Global Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://www.edurizon.in" />
      </Head>

      {/* Google Analytics */}
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <ThemeProvider>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white text-xl font-semibold">
            Loading...
          </div>
        )}

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
            {/* {!shouldExcludeLayout && <NavHeader/>} */}
            {!shouldExcludeLayout && <Navbar />}
            {pathname === '/' ? <Home /> : <Component {...pageProps} />}
            <GoogleAnalytics gaId="G-Z25NZ103DJ" />
            <div id="footer">
              {!shouldExcludeLayout && <CTASectionComponent />}
            </div>
          </>
        )}
      </ThemeProvider>
    </>
  );
}

export default MyApp;
