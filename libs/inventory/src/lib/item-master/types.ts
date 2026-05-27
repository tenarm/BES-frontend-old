export interface ItemDetailsRead {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  base_price: string;
  uom_id: string;
  subsidiary_id: string | null;
  is_deleted: boolean;
  version_id: number;
  created_at: string;
  updated_at: string;

  costing_method: string;
  standard_cost: string;
  weighted_average_cost: string;
  safety_stock: string;
  reorder_point: string;
  is_serial_tracked: boolean;
  is_lot_tracked: boolean;
  notes: string | null;
}

export interface UomConversion {
  id?: string;
  product_id?: string;
  from_uom_id: string;
  to_uom_id: string;
  multiplier: string;
  created_at?: string;
}

export interface UomRecord {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface LotRecord {
  id?: string;
  product_id?: string;
  lot_number: string;
  manufacturing_date: string | null;
  expiry_date: string | null;
  is_active?: boolean;
  created_at?: string;
}
