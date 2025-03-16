// interface PostArrival {
//     id: string;
//     data:string;
// }
import { useContext } from "react";
import Image from "next/image";
import ThemeContext from '@/context/themeContext'


const PostArrival = ({ }) => {
    const useTheme=()=>useContext(ThemeContext);
    const { theme } = useTheme();
    console.log(theme);
    const imageSrc =
      theme == "dark"
        ? ["/assets/Images/CountryBlogs/postArrival/academicSupportDark.png","/assets/Images/CountryBlogs/postArrival/culturalDark.png","/assets/Images/CountryBlogs/postArrival/termSupportDark.png"]
        : ["/assets/Images/CountryBlogs/postArrival/academicSupport.png","/assets/Images/CountryBlogs/postArrival/cultural.png","/assets/Images/CountryBlogs/postArrival/termSupport.png"];
    return (
        <div className=" flex flex-col items-center mx-[6vw] md:mx-[12.5vw] gap-[10vw] md:gap-[4vw] md:p-[4vw] ">
            <h3 className="text-h5TextPhone md:text-h3Text text-center font-bold leading-[130%]">Post-Arrival Support</h3>
            <div className="flex flex-col gap-[5vw] md:gap-[2vw]">
                <div className="flex flex-col gap-[6vw] md:gap-[1.5vw]">
                    <div className="flex gap-[6vw] md:gap-[1.5vw] items-center">
                        <Image width={64} height={64} className="w-[10.5vw] md:w-[4vw] h-auto" src={imageSrc[0]} alt="Post Arrival Support" />                        
                        <h6 className="text-h6TextPhone md:text-h6Text font-bold">Academic & Administrative Support</h6>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-[8vw] md:gap-[2vw]">
                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                                University Registration
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Complete your registration by submitting essential original documents, such as an attested Class 12 mark sheet and passport. Additionally, undergo mandatory health check-ups at campus clinics to ensure a smooth start to your academic journey.
                            </p>
                            <br className="hidden md:block"/>
                        </div>

                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                                Visa Extension
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Edurizon ensures hassle-free annual renewal of your student visa by handling the submission of necessary documents, including attendance records (minimum 75% required), fee payment receipts, and university endorsement letters.
                            </p>
                            
                        </div>

                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                                Bank Account & Forex
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            To manage finances, open a ruble account at leading banks like Sberbank or Tinkoff by providing your passport and admission letter. Edurizon's partners can assist you in transferring funds from India at competitive forex rates, saving you time and money.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col gap-[6vw] md:gap-[1.5vw]">
                    <div className="flex gap-[6vw] md:gap-[1.5vw] items-center">
                        <Image width={64} height={64} className="w-[10.5vw] md:w-[4vw] h-auto " src={imageSrc[1]} alt="Post Arrival Support" />
                        <h6 className="text-h6TextPhone md:text-h6Text font-bold">Daily Life & Cultural Integration</h6>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-[8vw] md:gap-[2vw]">
                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                            Hostel Life
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Experience a comfortable stay in shared hostel rooms (2–3 students) equipped with heating, 24/7 Wi-Fi, and communal kitchens. Enjoy Indian meals featuring dal, roti, and rice in the campus mess. For example, Perm State Medical University hostels provide cozy accommodations tailored to their needs.
                            </p>
                            <br className="hidden md:block"/>
                        </div>

                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                            Health Insurance
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Secure your well-being with mandatory health insurance costing ₹20,000–30,000 annually. This comprehensive plan covers emergencies, outpatient visits, and hospitalization, giving you peace of mind during your stay.
                            </p>
                        </div>

                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                            Cultural Activities
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Immerse yourself in vibrant student life through Indian Student Association events, such as Diwali celebrations, cricket matches, and Bollywood movie nights. Expand your horizons by participating in university-hosted international food festivals and academic conferences.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col gap-[6vw] md:gap-[1.5vw]">
                    <div className="flex gap-[6vw] md:gap-[1.5vw] items-center">
                        <Image width={64} height={64} className="w-[10.5vw] md:w-[4vw] h-auto " src={imageSrc[2]} alt="Post Arrival Support" />
                        <h6 className="text-h6TextPhone md:text-h6Text font-bold">Long Term Support</h6>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-[8vw] md:gap-[2vw]">
                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                            Academic Mentoring
                            </span>
                            <p className="text-smallTextPhone md:text-regularText font-light">
                            Edurizon provides personalized guidance with quarterly academic reviews and referrals for FMGE/NEXT coaching to ensure your professional success.
                            </p>
                            <br className="hidden md:block"/>
                        </div>

                        <div className="flex flex-col gap-[2vw] md:gap-[.5vw]">
                            <span className="text-regularTextPhone md:text-regularText font-bold">
                            Emergency Assistance
                            </span>
                            <p className="text-smallTextPhone md:text-regularTextt font-light">
                            Stay supported at all times with Edurizon’s 24/7 helpline, offering immediate aid for medical, legal, or administrative issues.
                            </p>
                        </div>
                    </div>

                </div>
                <p className="text-regularText font-bold text-center">
                With comprehensive support across academics, daily life, and long-term planning, Edurizon empowers students to settle in confidently and thrive in their new environment.
                </p>
            </div>
        </div>
    );
    }

export default PostArrival;