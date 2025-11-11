import useLocalization from "@/context/localization-provider/localization-context";
import {
  Blocks,
  Bolt,
  Building,
  CalendarDays,
  Globe,
  Home,
  LayoutList,
  PackageOpen,
  Settings,
  ShieldUser,
  Ticket,
  Users,
} from "lucide-react";

export default function c() {
  // Translation
  const { t } = useLocalization();

  // Variables
  const sections = [
    {
      name: t("dashboard"),
      icon: Home,
      roles: ["admin", "manager"],
      items: [{ name: t("dashboard"), path: "/admin-dashboard", icon: Home }],
    },
    {
      name: t("crm"),
      icon: Bolt,
      roles: ["admin", "manager"],
      items: [
        { name: t("booking"), path: "/admin-dashboard/booking", icon: CalendarDays },
        { name: t("customers"), path: "/admin-dashboard/users", icon: Users },
      ],
    },
    {
      name: t("settings"),
      icon: Settings,
      roles: ["admin"],
      items: [
        { name: t("studio"), path: "/admin-dashboard/studio", icon: Building },
        { name: t("category"), path: "/admin-dashboard/category", icon: LayoutList },
        { name: t("service"), path: "/admin-dashboard/service", icon: PackageOpen },
        { name: t("addons"), path: "/admin-dashboard/addons", icon: Blocks },
        { name: t("coupon"), path: "/admin-dashboard/coupon", icon: Ticket },
        { name: t("admins"), path: "/admin-dashboard/admins", icon: ShieldUser },
      ],
    },
    {
      name: t("back-to-website"),
      icon: Globe,
      roles: ["admin", "manager"],
      items: [{ name: t("back-to-website"), path: "/", icon: Globe }],
    },
  ];

  return sections;
}
