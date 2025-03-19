import CTASection from '@/components/landingPage/CTASection';
import Image from 'next/image';
const NewPage=()=>{
    return<div>
        <Image width={2480.74} height={0} src="/assets/Images/Germany.png" className='w-full h-full' alt="studyInGermany" />
        <CTASection/>
    </div>
}

export default NewPage;