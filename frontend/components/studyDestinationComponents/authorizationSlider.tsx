import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface AuthorizationSliderProps {
  images: string[];
}

const AuthorizationSlider = ({ images }: AuthorizationSliderProps) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // tablet and below
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Usually better UX on mobile
          dots: true, // Add dots for mobile navigation
        },
      },
    ],
  };

  return (
    <div className="py-[10vw] md:py-[1vw] px-[6vw] md:px-[12.625vw]">
      <div className="mb-[5vw] md:mb-[1vw]">
        <h3 className="text-h5TextPhone md:text-h3Text text-center font-bold leading-[120%] mb-[5vw] md:mb-[1vw]">
          Authorization
        </h3>
      </div>
      <div className="max-w-full relative">
        <Slider {...settings} className="authorization-slider">
          {images.map((image, index) => (
            <div key={index} className="px-[2vw] md:px-[1vw]">
              <div className="relative h-[60vw] md:h-[30vw] overflow-hidden">
                <Image
                  src={image}
                  alt={`Authorization document ${index + 1}`}
                  fill
                  className="rounded-none object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AuthorizationSlider;

