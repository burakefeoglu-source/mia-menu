-- ============================================================
-- mia.menu — renk teması ve bölüm iç tasarımı (Faz 1.7)
-- ============================================================

alter table tenants add column theme_color text not null default 'rose'
  check (theme_color in ('rose', 'blue', 'emerald', 'amber', 'purple', 'slate', 'orange', 'teal'));

alter table menu_sections add column display_style text not null default 'list_image'
  check (display_style in ('list', 'list_image', 'grid'));
