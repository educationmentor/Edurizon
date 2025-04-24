import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Padding } from '@mui/icons-material';


const videoData = [
  {
    id: 1,
    title: 'Delhi Students Review | Study MBBS Abroad',
    channel: 'Edurizon Pvt Ltd',
    views: '27K views',
    time: '1 months ago',
    duration: '24:45',
    thumbnail: 'https://img.youtube.com/vi/ufv7rVtxZgI/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=ufv7rVtxZgI',
  },
  {
    id: 2,
    title: "UP Students Review about MBBS ABROAD",
    channel: 'Edurizon Pvt Ltd',
    views: '10M views',
    time: '3 years ago',
    duration: '3:03',
    thumbnail: 'https://img.youtube.com/vi/by0AhfIJ3JQ/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=by0AhfIJ3JQ',
  },
  {
    id: 3,
    title: 'Why Edurizon is best MBBS Abroad Consultant ? Bihar Students Review',
    channel: 'Edurizon Pvt Ltd',
    views: '44K views',
    time: '2 months ago',
    duration: '18:32',
    thumbnail: 'https://img.youtube.com/vi/3a6NCxM8F0M/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=3a6NCxM8F0M',
  },
  {
    id: 2,
    title: "West Bengal Students Review | Study MBBS Abroad",
    channel: 'Edurizon Pvt Ltd',
    views: '10M views',
    time: '3 years ago',
    duration: '3:03',
    thumbnail: 'https://img.youtube.com/vi/q48PbIuHhRU/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=q48PbIuHhRU',
  },
  {
    id: 3,
    title: 'West Bengal Students Review | Study MBBS Abroad',
    channel: 'Edurizon Pvt Ltd',
    views: '44K views',
    time: '2 months ago',
    duration: '18:32',
    thumbnail: 'https://img.youtube.com/vi/5Da1bRZzhXE/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=5Da1bRZzhXE',
  },
  {
    id: 2,
    title: "MBBS Abroad for Indian Students | Haryana Students Share Honest Reviews",
    channel: 'Edurizon Pvt Ltd',
    views: '10M views',
    time: '3 years ago',
    duration: '3:03',
    thumbnail: 'https://img.youtube.com/vi/MiJMbsJ8Efg/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=MiJMbsJ8Efg',
  },
  {
    id: 3,
    title: 'Assam Students Review MBBS Abroad',
    channel: 'Edurizon Pvt Ltd',
    views: '44K views',
    time: '2 months ago',
    duration: '18:32',
    thumbnail: 'https://img.youtube.com/vi/3hyKvhTFucg/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=3hyKvhTFucg',
    
  },
];

const VideoCarousel = () => {
    const settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 3000,
      slidesToShow: 4,
      slidesToScroll: 1,
      pauseOnHover: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 768,
          settings: { slidesToShow: 1 },
        },
      ],
    };
  
    return (
      <div className=" mb-[10vw] md:mb-[8vw] ">
        <h2 className="text-center text-h5TextPhone md:text-h3Text font-bold mb-[2vw] md:mb-[1vw] leading-[130%]">What Our Students Has To Say About Us</h2>
        <Slider {...settings} className='px-[2vw] md:px-0 flex flex-row items-start justify-start'>
          {videoData.map((video) => (
            <div key={video.id} className="">
              <a href={video.link} target="_blank" rel="noopener noreferrer">
                <div className=''>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded-[2vw] md:rounded-[.5vw] border-gray-500 w-auto h-auto object-cover"
                  />
                  </div>
                <div className="mt-[2vw] md:mt-[1vw]">
                  <p className="font-semibold line-clamp-1 text-smallTextPhone md:text-regularText">{video.title}</p>
                  <p className="text-gray-600 text-tinyTextPhone md:text-tinyText">{video.channel}</p>
                </div>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    );
  };
  
  export default VideoCarousel;