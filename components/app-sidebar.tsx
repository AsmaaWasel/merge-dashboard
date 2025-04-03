"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar, Home, Inbox, LogOut, ChartBar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({
  dir = "ltr",
  ...props
}: React.ComponentProps<typeof Sidebar> & { dir?: "ltr" | "rtl" }) {
  const t = useTranslations("Sidebar");
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const pathname = usePathname();

  const items = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("statistics"), url: "/charts", icon: ChartBar },
  ];

  const MenuLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link>
  >(({ href, children, ...props }, ref) => (
    <Link href={href} ref={ref} {...props}>
      {children}
    </Link>
  ));
  MenuLink.displayName = "MenuLink";

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        side={dir === "rtl" ? "right" : "left"}
        {...props}
      >
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/merge-blue.png"
              alt="Company Logo"
              width={40}
              height={40}
            />
            {isExpanded && <span className="font-semibold">Merge</span>}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={isExpanded ? "" : "sr-only"}>
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <MenuLink
                            href={item.url}
                            className="flex items-center w-full"
                          >
                            <item.icon className={isExpanded ? "mr-2" : ""} />
                            {isExpanded && <span>{item.title}</span>}
                          </MenuLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!isExpanded && (
                        <TooltipContent side={dir === "rtl" ? "left" : "right"}>
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild>
                <MenuLink href="#" className="flex items-center w-full">
                  <LogOut className={isExpanded ? "mr-2" : ""} />
                  {isExpanded && <span>{t("logout")}</span>}
                </MenuLink>
              </SidebarMenuButton>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side={dir === "rtl" ? "left" : "right"}>
                {t("logout")}
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
