export type Tenant = {
  id: string;
  slug: string;
  name: string;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  default_locale: string;
  is_active: boolean;
};

export type MenuSection = {
  id: string;
  tenant_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export type Allergen = {
  id: string;
  code: string;
  name_tr: string;
  name_en: string;
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
};

export type TableQr = {
  id: string;
  tenant_id: string;
  location_id: string | null;
  label: string;
  qr_token: string;
};
