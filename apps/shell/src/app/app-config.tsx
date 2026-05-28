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
  Settings,
  BarChart3,
  Briefcase,
  Wrench,
  LifeBuoy,
} from 'lucide-react';

import { FLOW_NAMES, DATA_HUB_NAMES, SYSTEM_NAMES, FLOW_ICONS, capitalize } from '@tenarm/shared-ui';

/** Icon mapping for flows, data-hub, and system items */
export const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  // Top-level
  home: <Home size={20} />,

  // Flows
  sell: <CircleDollarSign size={20} />,
  buy: <Truck size={20} />,
  stock: <Package size={20} />,
  money: <BarChart3 size={20} />,
  people: <Users size={20} />,
  customers: <HeadphonesIcon size={20} />,
  manufacture: <Factory size={20} />,
  projects: <ClipboardList size={20} />,
  assets: <Wrench size={20} />,
  support: <LifeBuoy size={20} />,

  // Data Hub (reuse same icons)
  suppliers: <Truck size={20} />,
  products: <Package size={20} />,
  accounts: <Briefcase size={20} />,
  employees: <Users size={20} />,

  // System
  settings: <Settings size={20} />,
};

export { FLOW_NAMES, DATA_HUB_NAMES, SYSTEM_NAMES, FLOW_ICONS, capitalize };
