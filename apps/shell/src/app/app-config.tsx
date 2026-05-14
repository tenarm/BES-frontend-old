import React from 'react';
import { 
  Home,
  CircleDollarSign,
  ShoppingCart,
  Package,
  Users,
  HeadphonesIcon,
  Factory,
  ClipboardList,
  Truck,
  ShieldCheck,
  Monitor,
  BarChart,
  FileText,
  Megaphone,
  LifeBuoy,
  GraduationCap,
  Settings
} from 'lucide-react';

import { 
  MODULE_NAMES, 
  RESOURCE_NAMES, 
  capitalize 
} from '@bes/shared-ui';

// Map module keys to Icons
export const MODULE_ICONS: Record<string, React.ReactNode> = {
  home: <Home size={20} />,
  finance: <CircleDollarSign size={20} />,
  sales: <ShoppingCart size={20} />,
  inventory: <Package size={20} />,
  hr: <Users size={20} />,
  crm: <HeadphonesIcon size={20} />,
  manufacturing: <Factory size={20} />,
  project_management: <ClipboardList size={20} />,
  supply_chain: <Truck size={20} />,
  quality_management: <ShieldCheck size={20} />,
  asset_management: <Monitor size={20} />,
  bi: <BarChart size={20} />,
  document_management: <FileText size={20} />,
  marketing: <Megaphone size={20} />,
  service_desk: <LifeBuoy size={20} />,
  education: <GraduationCap size={20} />,
  settings: <Settings size={20} />
};

export { MODULE_NAMES, RESOURCE_NAMES, capitalize };
