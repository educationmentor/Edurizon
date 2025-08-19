// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const { pathname } = useRouter();
//   const router = useRouter();
//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminData');
//     router.push('/admin');
//   };
//   const navItems = [
//     {
//       href: "/admin/counsellor",
//       icon: "/assets/Images/admin/overview.svg",
//       label: "Overview",
//     },
//   {
//     href: "/admin/counsellor/session-records",
//     icon: "/assets/Images/admin/session-records.svg",
//     label: "Session Records",
//   },
//   {
//     href: "/admin/counsellor/create-session",
//     icon: "/assets/Images/admin/session.svg",
//     label: "Create Session",
//   },
//   {
//     href: "/admin/counsellor/sessions-record",
//     icon: "/assets/Images/admin/message.svg",
//     label: "Message",
//   },
// ];

//   return (
//     <div className="min-h-screen bg-white text-gray-900 flex">
//       <aside className=" w-[280px] bg-adminBgChosen text-white flex flex-col  ">
//               <div className=' mx-auto'>
//                 <div className="mt-[48px] text-2xl font-bold"><p className='text-center'>EDURIZON</p></div>
//                 <nav className="mt-[40px] mb-[228px] flex flex-col gap-[16px]">
//                   {navItems.map((item) => (
//         <Link key={item.href} href={item.href}>
//           <button
//             className={`w-[224px] py-[12px] px-[16px] rounded-[4px] text-white flex gap-[12px] hover:bg-adminGreenChosen 
//               ${pathname === item.href ? "bg-adminGreenChosen font-semibold" : "font-medium"}`}
//           >
//             <Image
//               src={item.icon}
//               width={40}
//               height={40}
//               className="w-[24px] h-[24px]"
//               alt={`${item.label.toLowerCase()} icon`}
//             />
//             {item.label}
//           </button>
//         </Link>
//       ))}
                  
//                 </nav>
//               </div>
//               <div className="mx-auto">
//                 <button className={`w-[224px] py-[12px] px-[16px] rounded-[4px]  text-white bg-[rgba(255,255,255,0.08)]  flex gap-[12px] hover:bg-adminGreenChosen  ${pathname=='/admin/counsellor/create-sessions'?"bg-adminGreenChosen font-semibold":"font-medium"}`}>
//                     <Image src="/assets/Images/admin/logout.svg" width={40} height={40} className='w-[24px] h-[24px]' alt='message icon'/> Logout
//                     </button>

//                 {/* <div className="mt-[76px] text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div>
//                       <div className="font-medium">Username</div>
//                       <div className="text-xs text-gray-400">View profile</div>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>
//             </aside>
//       <main className="flex-1 p-6 space-y-6 overflow-auto">{children}</main>
//     </div>
//   );
// }


