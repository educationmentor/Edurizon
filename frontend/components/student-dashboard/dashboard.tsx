import React from 'react'
import Image from 'next/image'
import { TransitionLink } from '@/utils/TransitionLink'

interface Notification {
  _id?: string;
  message: string;
  sentAt: string;
  isRead: boolean;
}

interface DashboardProps {
  userData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  notificationsLoading: boolean;
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  formatNotificationDate: (date: string) => string;
}

const Dashboard = ({
  userData,
  activeTab,
  setActiveTab,
  notifications,
  notificationsLoading,
  unreadCount,
  onNotificationClick,
  formatNotificationDate
}: DashboardProps) => {
  return (
    <div className='flex flex-col gap-[3vw]'>
        {/* Banner */}
        <div className='w-full flex flex-row rounded-[1vw] px-[1vw]' style={{
        background: 'linear-gradient(0deg, #FF7500 0%,#FF7500 50%, #F39D68 100%)'
        }}>
        <div className='ml-[3vw] py-[3vw] flex flex-col'>
        <p className='text-[rgba(255,255,255,.75)] text-regularTextPhone md:text-regularText'>{new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</p>
        <p className='mt-auto text-white text-h4TextPhone md:text-h4Text font-semibold leading-[120%]'>Welcome back, {userData.name.charAt(0).toUpperCase() + userData.name.slice(1).split(' ')[0]}</p>
        <p className='text-[rgba(255,255,255,.75)] text-regularTextPhone md:text-regularText'>Lets Resume With Your Abrod Journey</p>

        </div>

        <Image src='/assets/Images/student-dashboard/student-dashboard.png' className='ml-auto w-[32vw] h-auto' alt='banner' width={800} height={800} />

        </div>

        {/*  */}
        <span className='font-bold md:text-mediumText mb-[-2vw]'>Quick Links</span>

        <div className='flex gap-[3.25vw]'>
            {/* Left Side */}
            <div className='flex flex-col gap-[3vw]'>
                <div className='flex flex-col gap-[.75vw]'>
                    <div className='flex gap-[1.5vw]'>
                        <div onClick={() => setActiveTab('application-status')} className='py-[2vw] px-[1vw] w-[14vw] h-[14vw] items-center justify-center hover:border-[1px] hover:border-orangeChosen hover:bg-orangeChosen/10 cursor-pointer transition-all duration-300 ease-in-out rounded-[.75vw] flex flex-col shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] '>
                            <Image src='/assets/Images/student-dashboard/application-status.svg' alt='application-status' width={128} height={128} className='w-[4vw] h-[4vw] mb-[.5vw]' />
                            <span className='font-bold md:text-mediumText text-nowrap'>Application Status</span>
                            <span className=' md:text-regularText text-[rgba(0,0,0,.5)]'>{userData.applicationStage}</span>
                        </div>
                        <div onClick={() => setActiveTab('documents')} className='py-[2vw] px-[1vw] w-[14vw] h-[14vw] items-center justify-center hover:border-[1px] hover:border-orangeChosen hover:bg-orangeChosen/10 cursor-pointer transition-all duration-300 ease-in-out rounded-[.75vw] flex flex-col shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] '>
                            <Image src='/assets/Images/student-dashboard/documents.svg' alt='documents' width={128} height={128} className='w-[4vw] h-[4vw] mb-[.5vw]' />
                            <span className='font-bold md:text-mediumText text-nowrap'>Documents</span>
                            <span className=' md:text-regularText text-[rgba(0,0,0,.5)]'>Upload</span>
                        </div>
                        <div onClick={() => setActiveTab('language-courses')} className='py-[2vw] px-[1vw] w-[14vw] h-[14vw] items-center justify-center hover:border-[1px] hover:border-orangeChosen hover:bg-orangeChosen/10 cursor-pointer transition-all duration-300 ease-in-out rounded-[.75vw] flex flex-col shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] '>
                            <Image src='/assets/Images/student-dashboard/language-prep.svg' alt='language-prep' width={128} height={128} className='w-[4vw] h-[4vw] mb-[.5vw]' />
                            <span className='font-bold md:text-mediumText text-nowrap'>Language Prep</span>
                            <span className=' md:text-regularText text-[rgba(0,0,0,.5)]'>Learn</span>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-[.75vw]'>
                <span className='font-bold md:text-mediumText mb-[-2vw]'>Others</span><br/>
                    <div className='flex gap-[1.5vw]'>
                        <div onClick={() => setActiveTab('meetings')} className='py-[1vw] px-[1vw] w-[22vw] h-[10vw]  hover:border-[1px] hover:border-orangeChosen hover:bg-orangeChosen/10 cursor-pointer transition-all duration-300 ease-in-out rounded-[.75vw] flex flex-row gap-[4vw] shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] '>
                           <div className='flex flex-col gap-[.5vw]'>
                           <span className='font-bold md:text-mediumText text-nowrap text-orangeChosen'>Meetings</span>
                           <button className='bg-orangeChosen text-white text-center rounded-[1.75vw] w-[8vw] h-[2vw] text-regularText font-bold mt-auto'>
                            View
                           </button>
                           </div>
                            <Image src='/assets/Images/student-dashboard/meetings.svg' alt='application-status' width={128} height={128} className='ml-auto w-[7vw] h-[7vw] ' />
                        </div>

                        <TransitionLink href='/aboutUs'>
                        <div className='py-[1vw] px-[1vw] w-[22vw] h-[10vw]  hover:border-[1px] hover:border-orangeChosen hover:bg-orangeChosen/10 cursor-pointer transition-all duration-300 ease-in-out rounded-[.75vw] flex flex-col gap-[.5vw] shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] '>
                        <span className='font-bold md:text-mediumText text-nowrap text-orangeChosen'>Our Counsellors</span>
                           
                           <div className='flex flex-row gap-[.5vw]'>
                           <Image src='/assets/Images/Team/maidulSir.png' alt='application-status' width={128} height={128} className='w-[5vw] h-[5vw] rounded-full border-[4px] border-orangeChosen' />
                           <Image src='/assets/Images/Team/sanjaySir.png' alt='application-status' width={128} height={128} className='w-[5vw] h-[5vw] rounded-full border-[4px] border-orangeChosen' />
                           <Image src='/assets/Images/Team/karishmaMam.png' alt='application-status' width={128} height={128} className='w-[5vw] h-[5vw] rounded-full border-[4px] border-orangeChosen' />

                           </div>
                        </div>
                        </TransitionLink>
                    </div>
                </div>

            </div>

            {/*Right Side */}
            <div className='flex flex-col gap-[1.5vw] w-full max-w-[28vw] px-[1.25vw] py-[1.5vw] rounded-[.75vw] shadow-[.5vw_.5vw_3vw_.5vw_rgba(0,_0,_0,_0.08)] bg-white'>
              <div className='flex items-center justify-between flex-wrap gap-[.75vw]'>
                <div>
                  <p className='text-[.7vw] uppercase tracking-[0.2em] text-[rgba(0,0,0,.4)] font-semibold'>Notifications</p>
                  <h3 className='text-mediumText font-bold text-[#1A1A1A] leading-tight'>Stay in the loop</h3>
                  <p className='text-smallText text-[rgba(0,0,0,.5)]'>Updates from your counsellors & admin team.</p>
                </div>
                <span className='px-[1vw] py-[.35vw] rounded-full text-smallText font-semibold bg-orangeChosen/10 text-orangeChosen'>
                  {unreadCount} unread
                </span>
              </div>

              {notificationsLoading ? (
                <div className='flex items-center justify-center py-[3vw]'>
                  <div className='animate-spin rounded-full h-[2.5vw] w-[2.5vw] border-b-[3px] border-orangeChosen'></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-[1vw] py-[4vw] text-center'>
                  <div className='w-[4vw] h-[4vw] rounded-full bg-orangeChosen/10 flex items-center justify-center text-orangeChosen text-mediumText font-bold'>
                    🔔
                  </div>
                  <p className='text-regularText text-[rgba(0,0,0,.5)]'>You’re all caught up. We’ll notify you when something changes.</p>
                </div>
              ) : (
                <div className='space-y-[.75vw] max-h-[22vw] overflow-y-auto pr-[.5vw]'>
                  {notifications.map((notification, index) => (
                    <button
                      key={notification._id ?? `${notification.sentAt}-${index}`}
                      onClick={() => onNotificationClick(notification)}
                      className={`w-full text-left flex items-start gap-[.75vw] rounded-[.75vw] border px-[1vw] py-[.8vw] transition-all ${
                        notification.isRead
                          ? 'bg-[#F7F8FA] border-transparent'
                          : 'bg-white border-orangeChosen/30 shadow-md shadow-orangeChosen/10'
                      }`}
                    >
                      <span
                        className={`mt-[.2vw] h-[.65vw] w-[.65vw] rounded-full ${
                          notification.isRead ? 'bg-gray-300' : 'bg-orangeChosen'
                        }`}
                      ></span>
                      <div className='flex-1'>
                        <p className='text-smallText font-medium text-[#1A1A1A]'>{notification.message}</p>
                        <p className='text-smallText text-[rgba(0,0,0,.5)] mt-[.35vw]'>
                          {formatNotificationDate(notification.sentAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className='text-[.75vw] font-semibold text-orangeChosen'>Mark as read</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
    </div>
  )
}

export default Dashboard
