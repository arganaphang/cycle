import { SidebarGroup, SidebarMenu, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuButton
            key={item.title}
            tooltip={item.title}
            render={
              <Link
                to={item.url}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              />
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
