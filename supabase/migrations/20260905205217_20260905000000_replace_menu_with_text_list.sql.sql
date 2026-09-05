/*
# Replace menu with text-based price list

1. Overview
- Removes all existing categories and menu_items.
- Creates a single "Oooh-Lala Menu" category.
- Inserts 14 new menu items representing the new text-based menu:
  Chicken (3 price tiers), Turkey (3 price tiers), Coleslaw, Egg,
  Fried Meat, Plantain, Pomo, Takeaway Pack, Moimoi, Beef.
- Each item has a name, slug, price, and default metadata.
  Images and gallery are set to empty strings/arrays since the menu
  is now a text-only list with no food images.

2. Tables affected
- menu_items: all existing rows deleted, 14 new rows inserted.
- categories: all existing rows deleted, 1 new row inserted.

3. Security
- No policy changes. Existing public-read policies remain in effect.

4. Important notes
- This is a full menu replacement as requested by the owner.
- The frontend will display items as a clean text list (no images,
  no cards, no ratings, no cook time).
- Chicken and Turkey each have 3 price tiers (₦2,000 / ₦3,000 / ₦4,000)
  stored as separate rows, grouped by name in the UI.
*/

DELETE FROM menu_items;
DELETE FROM categories;

INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
VALUES (
  'Oooh-Lala Menu',
  'ooh-lala-menu',
  'Freshly prepared meals and sides available for order.',
  '',
  1,
  true
);

WITH cat AS (SELECT id FROM categories WHERE slug = 'ooh-lala-menu' LIMIT 1)
INSERT INTO menu_items
  (category_id, name, slug, description, price, image_url, gallery, ingredients, nutrition_info, prep_time, rating, review_count, is_popular, is_available, sort_order)
VALUES
  ((SELECT id FROM cat), 'Chicken', 'chicken-2000', '', 2000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 1),
  ((SELECT id FROM cat), 'Chicken', 'chicken-3000', '', 3000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 2),
  ((SELECT id FROM cat), 'Chicken', 'chicken-4000', '', 4000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 3),
  ((SELECT id FROM cat), 'Turkey', 'turkey-2000', '', 2000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 4),
  ((SELECT id FROM cat), 'Turkey', 'turkey-3000', '', 3000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 5),
  ((SELECT id FROM cat), 'Turkey', 'turkey-4000', '', 4000.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 6),
  ((SELECT id FROM cat), 'Coleslaw', 'coleslaw', '', 500.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 7),
  ((SELECT id FROM cat), 'Egg', 'egg', '', 300.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 8),
  ((SELECT id FROM cat), 'Fried Meat', 'fried-meat', '', 300.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 9),
  ((SELECT id FROM cat), 'Plantain', 'plantain', '', 200.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 10),
  ((SELECT id FROM cat), 'Pomo', 'pomo', '', 300.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 11),
  ((SELECT id FROM cat), 'Takeaway Pack', 'takeaway-pack', '', 300.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 12),
  ((SELECT id FROM cat), 'Moimoi', 'moimoi', '', 500.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 13),
  ((SELECT id FROM cat), 'Beef', 'beef', '', 300.00, '', ARRAY[]::text[], ARRAY[]::text[], '{}'::jsonb, '', 0, 0, false, true, 14);
