import {
  Users,
  FileText,
  Landmark,
  MapPin,
  ShieldAlert,
  Vote,
  Newspaper,
  Shield,
  ClipboardList,
} from "lucide-react";

export const entityNavItems = [
  { href: "/politicians", label: "Politicians", icon: Users },
  { href: "/parties", label: "Parties", icon: Shield },
  { href: "/bills", label: "Bills", icon: FileText },
  { href: "/promises", label: "Promises", icon: ClipboardList },
  { href: "/committees", label: "Committees", icon: Landmark },
  { href: "/constituencies", label: "Constituencies", icon: MapPin },
  { href: "/controversies", label: "Controversies", icon: ShieldAlert },
  { href: "/elections", label: "Elections", icon: Vote },
  { href: "/news", label: "News", icon: Newspaper },
];
