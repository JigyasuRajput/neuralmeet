import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}
const layout = ({ children }: Props) => {
  return( 
  <SidebarProvider>
    <DashboardSidebar />
    <main className="flex flex-col h-screen w-screen bg-muted">
    {children}
    </main>
  </SidebarProvider>
  )
};

export default layout;