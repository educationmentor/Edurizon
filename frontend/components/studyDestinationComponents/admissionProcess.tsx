import React,{useState,useEffect} from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from "lucide-react";

const steps = [
    {
      title: "Personalized Profile Evaluation",
      content:
        "Edurizon starts with a free 30–minute consultation to evaluate your academic profile, budget, and career goals.",
      contentFull:<p className='text-smallTextPhone md:text-smallText leading-[150%]'>
        Edurizon starts with a free 30-minute consultation to evaluate your academic profile, budget, and career goals. Key factors include:
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] list-outside'>
            <li>NEET Score: Eligibility for MCI/NMC-approved universities.</li>
            <li>Class 12 Marks: Minimum 50% in PCB (40% for SC/ST/OBC).</li>
            <li>Preferences: Climate, university ranking, and specialization interests.</li>
            <li>Example: A student with 55% in PCB and a NEET score of 500 may be matched with options like Crimea Federal University (low fees, tropical climate) or Smolensk State Medical University (WHO-recognized, English-medium focus).
            </li>            
        </ul>
        Outcome: A curated list of universities, complete with pros, cons, and fee structures.
      </p>
    },
    {
      title: "Document Submission & Verification",
      content:<p className='text-smallTextPhone md:text-smallText leading-[150%]'>
            Submit the Following Documents 
            <ul className='list-disc pl-[6vw] md:pl-[1.5vw] list-outside'>
                <li>Academics: Class 10 & 12 mark sheets, NEET scorecard.</li>
            </ul>
            </p>,
    contentFull:<p className='text-smallTextPhone md:text-smallText leading-[150%]'>
        Submit the Following Documents 
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] list-outside'>
            <li>Academics: Class 10 & 12 mark sheets, NEET scorecard.</li>
            <li>Identity Proof: Passport (18+ months validity), birth certificate.</li>
            <li>Medical Fitness: HIV-negative and COVID-19 vaccination certificates.</li>
        </ul>
        
        Edurizon’s Role
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] list-outside'>
            <li>Translate documents into Regional Language</li>
            <li>Manage MEA and embassy attestation.</li>
            <li>Submit applications within 3–5 days.</li>
        </ul>
      </p>
    },
    {
      title: "Admission Letter & Entrance Exam",
      content:
        "Fee Payment: Transfer tuition fees directly to the university account.",
        contentFull:
        <ul className='list-disc pl-[6vw] md:pl-[1.5vw] list-outside'>
            <li>Fee Payment: Transfer tuition fees directly to the university account.</li>
            <li>Visa Application: Submit required documents (admission letter, passport, medical reports).</li>
        </ul>
    },
    {
      title: "Fee Payment & Visa Processing",
      content:
        "Edurizon assists with visa forms, embassy appointments, and discounted medical tests.",
        contentFull:<>Edurizon assists with visa forms, embassy appointments, and discounted medical tests.</>
    },
    {
      title: "Pre-Departure & Arrival",
      content:
        "Attend a pre-departure webinar covering climate tips, hostel guidelines, and cultural etiquette.",
        contentFull:<p>Attend a pre-departure webinar covering climate tips, hostel guidelines, and cultural etiquette. Upon arrival, university representatives provide airport pickup, meal services, and transport to hostels. Edurizon’s team ensures a smooth settlement, including room allocation and local SIM cards.
    <strong><br/><br/>
        With Edurizon, every step is streamlined, ensuring a stress-free start to your medical journey in your Desired Country.</strong></p>
    },
  ];

  interface StepProps {
    title: string;
    content: React.ReactNode;
    contentFull: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    isActive: boolean;
    islast:boolean;

  }

  const Step: React.FC<StepProps> = ({ title, content, isOpen, onClick, isActive, contentFull, islast }) => {
    const [show, setShow] = useState(false);
    const toggle = () => {
    setShow(!show);
    }
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
          setVisible(show);
        }, 300); // Transition duration
    
        return () => clearTimeout(timeout);
      }, [show]);
    
    useEffect(() => {
        setShow(false);
    },[isActive])
    return (
      <div className={`transition-all duration-500 relative  pl-[4vw] md:pl-[1vw] pb-[8vw] md:pb-[2vw] ${islast ? "" : "border-l-[2px] "}  ${isActive ? "border-black" : "border-[rgba(0, 0, 0, 0.5)]"}`}>
        <div onClick={onClick}
          className={`cursor-pointer absolute flex items-center justify-center bg-white border-[2px] top-0 left-[-2.5vw] md:left-[-.675vw] w-[5vw] h-[5vw] md:w-[1.25vw] md:h-[1.25vw] rounded-full ${
            isActive ? "  border-black" : "  border-[rgba(0, 0, 0, 0.5)]"
          }`}
        >
          <div className={`w-[3vw] md:w-[.75vw] h-[3vw] md:h-[.75vw] rounded-full ${isActive ? "bg-black" : "bg-transparent"}`}></div>
        </div>
        <button
         
          className={`flex items-center justify-between w-full text-left ${
            isActive ? "font-bold" : "font-semibold text-[rgba(0,0,0,.5)]"
          }`}
        >
          <h6  onClick={onClick} className='md:text-h6Text leading-[100%] md:mb-[.5vw]'>{title}</h6>
           <ChevronUp onClick={toggle} className={`transition-all duration-500 w-[4vw] md:w-[1vw] h-auto ${isActive && show?"rotate-0": "rotate-180"}`} />
        </button>

        <div className="relative transition-all duration-300 ease-in-out">
  {/* Conditionally rendered content with opacity transitions */}

  <div
    className={`transition-opacity duration-300 ease-in-out ${
      visible && isActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
    }`}
  >
    <p className={`text-smallTextPhone md:text-smallText pr-4 ${isActive ? 'text-black' : 'text-[rgba(0,0,0,.5)]'}`}>
      {content}
    </p>
  </div>

  <div
    className={`transition-opacity duration-500 ease-in-out ${
      visible && isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
    }`}
  >
    <div className={show ? 'text-black' : 'text-[rgba(0,0,0,.5)]'}>
      <div className="flex flex-row">
        <div className="flex text-smallTextPhone md:text-smallText">{contentFull}</div>
      </div>
    </div>
  </div>
</div>


      </div>
    );
  };


  interface AdmissionProps {
    subHeading: string;
  }

const AdmissionProcess = ({subHeading}:AdmissionProps) => {
    const headDescription="Attend a pre-departure webinar covering climate tips, hostel guidelines, and cultural etiquette. Upon arrival, university representatives provide airport pickup, meal services, and transport to hostels. Edurizon’s team ensures a smooth settlement, including room allocation and local SIM cards"
    const [openStep, setOpenStep] = useState<number>(-1);
    const [visible, setVisible] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    useEffect(() => {
        setVisible(false);
        const timeout = setTimeout(() => {
            if(openStep===-1){
                setCurrentStep(0);
            }else{
                setCurrentStep(openStep);
                }

          setVisible(true);
        }, 200); // Transition duration
    
        return () => clearTimeout(timeout);
      }, [openStep]);

    const toggle=(i: React.SetStateAction<number>)=>{
    if (openStep==i){
        return setOpenStep(-1)
    }
    setOpenStep(i)
    }

    return (
    <div className='bg-linenChosen py-[10vw] md:py-[4vw] px-[6vw] md:px-[12.625vw]'>
        <div className=' mb-[5vw] md:mb-[4vw]'>
            <h3 className='text-h5TextPhone md:text-h3Text text-center font-bold leading-[120%] mb-[5vw] md:mb-[1.5vw]'>Admission Process</h3>
            <h5 className='text-h6TextPhone font-bold text-left md:text-center md:text-h5Text md:font-medium leading-[140%] mb-[2vw] md:mb-[.5vw]'>{subHeading}</h5>
            <p className='text-smallTextPhone md:text-regularText text-justify leading-[150%]'>{headDescription}</p>
        </div>
        <div className='flex flex-col py-[10vw] md:py-0 md:flex-row items-start  md:gap-[6.875vw] '>
            <div className='md:ml-[1.25vw] md:w-[31.25vw]'>
            {steps.map((step, index) => (
                <Step
                key={index}
                title={step.title}
                content={step.content}
                isOpen={openStep === index}
                isActive={openStep === index}
                onClick={() => {setOpenStep(openStep === index ? 0: index),toggle(index)}}
                contentFull={step.contentFull}
                islast={index===steps.length-1}
                />
            ))}
            </div>
            <div  className={`transition-opacity duration-500 ease-in-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}>
                <Image width={1024} height={1024} src={`/assets/Images/admissionProcess/admissionProcess${currentStep+1}.webp`} alt='Admission Process' className='w-[90vw] md:w-[31.25vw] h-auto ' />
            </div>
        </div>
    </div>
  )
}

export default AdmissionProcess
