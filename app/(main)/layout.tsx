import { NavigationSidebar } from "@/components/navigation/navigaton-sidebar";
const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      {/* 侧边栏  */}
      <div className='hidden md:flex h-full w-[72px]
      z-30 flex-col fixed inset-y-0' > 
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
