import React from "react";
import Slider from "react-slick";
import Image from "next/image";

const logosData = [
    {  alt: "SF", src: "/assets/Images/universities/university1.png" },
    {  alt: "Jimmy Choo",src: "/assets/Images/universities/university2.png"},
    {  alt: "Burberry",src: "/assets/Images/universities/university3.png" },
    {  alt: "Bvlgari",src: "/assets/Images/universities/university4.png" },
    {  alt: "Prada",src: "/assets/Images/universities/university5.png" },
    {  alt: "Prada2",src: "/assets/Images/universities/university6.png" },
    
  ];

const AssociatedUniversitiesSection = () => {
    const slider = React.useRef(null);
          
    const settings = {
      className: "slider variable-width",
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      autoplay: true,
      speed: 1500,
      autoplaySpeed: 1500,
      cssEase: "linear",
      variableWidth: true,
      pauseOnHover: false,   
      pauseOnFocus: false, 
    };
    return (
        <div className="hidden md:flex h-[15vw] flex-col my-[2vw] gap-[2vw] justify-center items-center overflow-hidden">
            <h3 className="text-h3Text text-center font-bold">Associated University</h3>
            <div className="flex justify-center items-center overflow-hidden">
                <Slider className="w-full"  ref={slider} {...settings}>   
                        {logosData.map((logo, index) => (
                        <div key={index} className="flex relative justify-center items-center">
                        <Image height={60} width={60} src={logo.src} alt={logo.alt} className="max-h-full w-auto h-[6vw] object-contain"  />
                        </div>
                    ))}
                </Slider>
            </div>
            
      </div>
    )
}

export default AssociatedUniversitiesSection;