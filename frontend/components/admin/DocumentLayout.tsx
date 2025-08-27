import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraIcon from '@mui/icons-material/Camera';
import BreadcrumbAdmin from '@/components/BreadcumbAdmin';
interface AdminData {
          role: string;
          [key: string]: any;
}

export default function Layout({ children, navItems, searchTerm,setSearchTerm }: { children: React.ReactNode, navItems: Array<{ href: string, icon: React.ReactNode, label: string,  }>, searchTerm: string, setSearchTerm: (term: string) => void }) {
  const { pathname } = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  console.log("Search Term:", searchTerm);
  // Fetch Data of Admin from local Storage
  useEffect(() => {
    if(sessionStorage.getItem('adminData')){
      const adminDataString = sessionStorage.getItem("adminData");
      if (adminDataString) {
        const parsedData = JSON.parse(adminDataString);
        setAdminData(parsedData);}
    }else{
      const adminDataString = localStorage.getItem("adminData");
    if (adminDataString) {
      const parsedData = JSON.parse(adminDataString);
      setAdminData(parsedData);
    }

    }
    
    }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };  

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">

      {/* Side Bar */}
      <aside className=" w-[280px] bg-adminBgChosen text-white flex flex-col  ">
              <div className=' mx-auto'>
                <div className="mt-[48px] text-2xl font-bold"><p className='text-center'>EDURIZON</p></div>
                <nav className="mt-[40px] mb-[228px] flex flex-col gap-[16px]">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <button className={`w-[224px] py-[12px] px-[16px] rounded-[4px] text-white flex gap-[12px] hover:bg-adminGreenChosen 
                          ${pathname === item.href ? "bg-adminGreenChosen font-semibold" : "font-medium"}`}>
                        {item.icon} {item.label}
                      </button>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mx-auto mt-auto mb-[10vw]">
                <button onClick={handleLogout} className={`w-[224px] py-[12px] px-[16px] rounded-[4px]  text-white bg-[rgba(255,255,255,0.08)]  flex gap-[12px] hover:bg-adminGreenChosen  ${pathname=='/admin/counsellor/create-sessions'?"bg-adminGreenChosen font-semibold":"font-medium"}`}>
                     <LogoutIcon className='w-[24px] h-[24px]' /> Logout
                </button>

                {/* <div className="mt-[76px] text-sm">
                  <div className="flex items-center space-x-2">
                    <img src="https://via.placeholder.com/40" className="rounded-full w-10 h-10" />
                    <div>
                      <div className="font-medium">Username</div>
                      <div className="text-xs text-gray-400">View profile</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </aside>

      {/* Main Content */}
      <main className="flex-1   overflow-auto bg-[#F4F5F7]">

        {/* Navbar */}
        <nav className='border-b-2 items-center border-[#E8E8E8] px-[24px] py-[24px] flex'>
            <h4 className='font-bold text-h5Text'>Hello, {adminData?.firstName}</h4>
            <Image src="/assets/Images/admin/double-chevron-right.svg" width={20} height={20} className='ml-[2vw] w-[1.5vw] h-[1.5vw]' alt='arrow down icon' />
            {/* <h4 className='text-regularText text-[#9F9F9F] ml-[8px] mr-[24px]'>{new Date().toLocaleDateString()}</h4> */}
             <BreadcrumbAdmin  role={adminData?.role}/>
            <NotificationsIcon className='ml-auto' style={{fontSize: '40px', color: '#666666' }} />
            <CameraIcon className='ml-[16px]' style={{fontSize: '40px', color: '#666666' }} />
            <div className='ml-[32px] w-[340px] bg-white rounded-[16px]  h-[48px] overflow-hidden flex'>
                <input type="text" placeholder="Search..." className='w-full  h-full outline-none px-[12px] text-smallText' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <SearchIcon className='ml-auto my-auto mr-[12px]' style={{fontSize: '32px', color: '#666666'}}/>
            </div>
        </nav>

        {/* Children */}
        {children}
      </main>
    </div>
  );
}


