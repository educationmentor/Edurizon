import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { TransitionLink } from '@/utils/TransitionLink';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
interface ActionAreaCardProps {
  category: string;
  image: string | StaticImport;
  title: string;
  description: string;
  href: string;
}

export default function ActionAreaCard({ category, image, title, description, href }: ActionAreaCardProps) {
  return (
    <TransitionLink href={href}>
    <Card sx={{ maxWidth:innerWidth>768? 416:300,borderRadius: innerWidth>768? '16px':'8px' }} elevation={10}>
      <CardActionArea > 
        <Image src={image} alt={title} width={140} height={140} layout='responsive' />
          <div className='font-roboto mt-[12px] md:mt-[24px] mb-[8px] md:mb-[12px] mx-[8px] flex flex-col gap-[8px]'>
          <span className=' font-bold text-[12px] md:text-[14px] '>
            {category}
            </span>
            <h2 className='font-poppins font-bold text-[14px] md:text-[18px] lg:text-[20px] xl:text-[24px] md:overflow-hidden md:text-nowrap text-ellipsis '>{title}</h2>
          <p className='text-[12px] md:text-[14px] xl:text-[16px] md:max-h-[60px] lg:max-h-[96px] overflow-hidden text-ellipsis line-clamp-2 md:line-clamp-3 lg:line-clamp-4' >{description}</p>
          <span className='text-center font-poppins text-[10px] md:text-[12px] '>Edurizon@2025</span>
          </div>
      </CardActionArea>
    </Card>
    </TransitionLink>
  );
}