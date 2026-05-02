import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuButton key={item.title} tooltip={item.title} render={<a href={item.url} />}>
            {item.icon}
            <span>{item.title}</span>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
