import { TitleButton } from "@/components/Buttons";
import React from "react";

// This is a placeholder for your map link
const mapLink = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.2553018646577!2d77.0454665!3d28.592116899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b2870491009%3A0x8b3922528c2683f6!2sEdurizon%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1746528635326!5m2!1sen!2sin";

const ContactUs = () => {

    const callBtnFnc=()=>{
        window.location.href = "tel:+919873381377"
    }
    const whatsappBtnFnc=()=>{
        window.open('https://wa.me/919873381377?')
    }
  return (
    <div className="container mt-[10vw] mb-[20vw] md:mb-[10vw] md:mt-[3vw] mx-[6vw] md:mx-[12.5vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[8vw] md:gap-[2vw]">
        {/* First Column - Company Information */}
        <div className="md:py-[5vw]">
          <h2 className="font-bold mb-[2vw] text-h4TextPhone md:text-h3Text text-orangeChosen text-center">Contact Us</h2>
          <div>
            <h3 className="text-h6TextPhone md:text-h5Text mb-[2vw] md:mb-[1vw]">Edurizon Private Limited</h3>
            <p className="text-regularTextPhone md:text-regularText mb-[2vw] md:mb-[1vw]">111,113,115,1st floor, Best Arcade, market, beside Canara Bank, near K.M. Chowk, Sector 7 Extension, Pocket 6, Sector 12 Dwarka, Dwarka, New Delhi, Delhi, 110075</p>
          </div>
          <div className="flex flex-col md:flex-row gap-[3vw] md:gap-[.5vw] ">
            <button className="bg-green-500 text-white rounded-[17.5vw] md:rounded-[6.25vw] w-full md:w-[16.1875vw] h-[11vw] md:h-[3vw]" onClick={whatsappBtnFnc}>Connect with us on WhatsApp</button>
            <TitleButton btnTitle={"Call Us Now"} btnHeight={3} btnHeightPhone={11} btnWidth={16.1875} btnWidthPhone={92} btnRadius={6.25} btnRadiusPhone={17.5}  onClick={callBtnFnc}/>
          </div>
        </div>

        {/* Second Column - Map */}
        <div>
          <iframe
            src={mapLink}
            className="rounded-lg shadow-md w-[100%] h-[300px] md:h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
