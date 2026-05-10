import React from 'react';
import { 
  ShoppingCart, 
  CircleDollarSign, 
  Package, 
  Users, 
  Home 
} from 'lucide-react';

// Map module keys to Icons
export const MODULE_ICONS: Record<string, React.ReactNode> = {
  home: <Home size={20} />,
  sales: <ShoppingCart size={20} />,
  finance: <CircleDollarSign size={20} />,
  inventory: <Package size={20} />,
  hr: <Users size={20} />
};

// Map module keys to Display Names
export const MODULE_NAMES: Record<string, string> = {
  sales: 'Sales & Distribution',
  hr: 'HR & Payroll'
};

export const RESOURCE_NAMES: Record<string, string> = {
  coa: 'COA'
};

export const capitalize = (s: string) => RESOURCE_NAMES[s] || (s.charAt(0).toUpperCase() + s.slice(1));
