import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ApplicationStatus = ({userData}: {userData: any}) => {
  const applicationStages = [
    {
      id: 1,
      title: 'Consultation',
      description: 'Talk to our expert counsellors anytime. Get help with shortlisting the best-fit universities.',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Documents upload',
      description: 'Upload your documents quickly and securely. Complete this step to avoid delays in your application.',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Document verification',
      description: 'We\'re checking your documents for accuracy. You\'ll be notified if any updates are needed.',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Selected university application',
      description: 'Your application has been sent to your chosen university. We\'ll keep you updated on every progress made.',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Offer letter',
      description: 'Your offer letter is ready to download and review. Accept it to move to the visa process smoothly.',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Visa approval',
      description: 'Your visa application is under process. Stay tuned – we\'ll inform you once it\'s approved.',
      status: 'pending'
    }
  ];

  const getCurrentStage = () => {
    const stageMap: {[key: string]: number} = {
      'Consultation': 1,
      'Document Upload': 2,
      'Document Verification': 3,
      'Selected University Application': 4,
      'Offer Letter': 5,
      'Visa Approval': 6
    };
    return stageMap[userData.applicationStage] || 1;
  };

  const currentStage = getCurrentStage();

  return (
    <div className='h-full w-full p-[2vw]'>
      <div className='max-w-[50vw] mx-auto'>
        <h2 className='text-h4TextPhone md:text-h4Text font-bold text-gray-800 mb-[3vw] text-center'>
          Application Status
        </h2>
        
        <div className='relative'>
          {/* Vertical line */}
          <div 
            className='absolute left-[1.5vw] top-[1.5vw] bottom-[1.5vw] w-[2px]' 
            style={{
              background: 'repeating-linear-gradient(to bottom, transparent, transparent 3px, #d1d5db 3px, #d1d5db 6px)',
              transform: 'translateX(-1px)'
            }}
          ></div>
          
          {applicationStages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isCompleted = stage.id < currentStage;
            const isPending = stage.id > currentStage;
            
            return (
              <div key={stage.id} className='relative flex items-center mb-[1.5vw] last:mb-0'>
                {/* Step number circle */}
                <div className={`relative z-10 w-[3vw] h-[3vw] rounded-full flex items-center justify-center text-white font-bold text-[1.2vw] flex-shrink-0 ${
                  isActive || isCompleted 
                    ? 'bg-[#FF7500]' 
                    : 'bg-gray-300'
                }`} style={{marginLeft: '-1px'}}>
                  {isCompleted ? (
                    <CheckCircleIcon style={{fontSize: '1.5vw', color: 'white'}} />
                  ) : (
                    stage.id
                  )}
                </div>
                
                {/* Content */}
                <div className='ml-[2vw] flex-1'>
                  <div className={`p-[1.5vw] rounded-[.5vw] ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-100 to-pink-200 border-l-4 border-[#FF7500]' 
                      : ''
                  }`}>
                    <div className='flex items-center justify-between'>
                      <h3 className={`text-h6TextPhone md:text-h6Text font-bold ${
                        isActive ? 'text-gray-800' : 'text-gray-700'
                      }`}>
                        {stage.title}
                        {isPending && (
                          <span className='ml-[1vw] text-gray-500 text-[1vw] font-normal'>(Pending)</span>
                        )}
                      </h3>
                      {isActive && (
                        <ArrowForwardIosIcon style={{fontSize: '1.2vw', color: '#FF7500'}} />
                      )}
                    </div>
                    <p className='text-regularTextPhone md:text-regularText text-gray-600 mt-[.5vw]'>
                      {stage.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default ApplicationStatus
