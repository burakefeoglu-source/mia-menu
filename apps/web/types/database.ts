export type Tenant = {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  default_locale: string;
  is_active: boolean;
  qr_style: 'square' | 'rounded' | 'dot';
  theme_color: string;
  menu_layout: 'classic' | 'dark' | 'minimal';
  section_nav: 'tabs' | 'grid';
};

export type MenuSection = {
  id: string;
  tenant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  display_style: 'list' | 'list_image' | 'grid';
};

export type Allergen = {
  id: string;
  tenant_id: string | null;
  code: string | null;
  name_tr: string;
  name_en: string | null;
  description: string | null;
};

export type Product = {
  id: string;
  tenant_id: string;
  section_id: string;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_favorite: boolean;
};

export type Tag = {
  id: string;
  tenant_id: string;
  name: string;
};

export type Review = {
  id: string;
  tenant_id: string;
  customer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Location = {
  id: string;
  tenant_id: string;
  name: string;
  address: string | null;
  phone: string | null;
};

export type TableQr = {
  id: string;
  tenant_id: string;
  location_id: string | null;
  label: string;
  qr_token: string;
};

export type Announcement = {
  id: string;
  tenant_id: string;
  kind: 'poster' | 'text';
  title: string | null;
  message: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  tenant_id: string;
  table_id: string | null;
  order_type: 'dine_in' | 'takeaway';
  table_note: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: OrderStatus;
  total: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};
