/*
# Revert text-menu change — restore original card-based menu

1. Overview
- Removes the single "Oooh-Lala Menu" category and 14 text-only menu items
  that were inserted by the 20260905000000_replace_menu_with_text_list migration.
- Restores the 8 original categories with their uploaded local images
  (Jollof Rice, Fried Rice, Turkey, Chicken, Fried Fish, Salad, Moimoi,
  Jollof Spaghetti) — matching the state after the image-replacement
  updates but before the text-menu change.
- Restores the 15 original menu items with images, ratings, prep times,
  galleries, ingredients, nutrition info, and popular flags.

2. Tables affected
- menu_items: all current rows deleted, 15 original rows re-inserted.
- categories: all current rows deleted, 8 original rows re-inserted.

3. Security
- No policy changes. Existing public-read policies remain in effect.

4. Important notes
- Category images use the uploaded local images for the 5 food types
  that were replaced in earlier sessions (jollof-rice, fried-rice, fish,
  moimoi, spaghetti). Other categories keep their original Pexels images.
- Menu items for jollof-rice, fried-rice, fish, moimoi, spaghetti categories
  use local uploaded images. Other items keep Pexels URLs.
- This exactly restores the pre-text-menu state.
*/

DELETE FROM menu_items;
DELETE FROM categories;

-- Restore 8 categories with uploaded local images where applicable
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
VALUES
  ('Jollof Rice', 'jollof-rice', 'Delicious Nigerian party-style jollof rice served fresh.', '/images/categories/image.png', 1, true),
  ('Fried Rice', 'fried-rice', 'Flavorful fried rice served with tasty turkey.', '/images/categories/image copy 2.png', 2, true),
  ('Turkey', 'turkey', 'Glazed and roasted turkey', 'https://images.pexels.com/photos/14560071/pexels-photo-14560071.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3, true),
  ('Chicken', 'chicken', 'Juicy grilled chicken', 'https://images.pexels.com/photos/37081053/pexels-photo-37081053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4, true),
  ('Fried Fish', 'fish', 'Crispy, well-seasoned fried fish prepared fresh daily.', '/images/categories/image copy.png', 5, true),
  ('Salad', 'salad', 'Fresh garden salads', 'https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6, true),
  ('Moimoi', 'moimoi', 'Soft and delicious steamed bean pudding.', '/images/categories/image copy 3.png', 7, true),
  ('Jollof Spaghetti', 'spaghetti', 'Rich and spicy jollof-style spaghetti with chicken.', '/images/categories/image copy 4.png', 8, true);

-- Restore 15 original menu items
WITH
  cat_jollof AS (SELECT id FROM categories WHERE slug = 'jollof-rice'),
  cat_fried AS (SELECT id FROM categories WHERE slug = 'fried-rice'),
  cat_turkey AS (SELECT id FROM categories WHERE slug = 'turkey'),
  cat_chicken AS (SELECT id FROM categories WHERE slug = 'chicken'),
  cat_fish AS (SELECT id FROM categories WHERE slug = 'fish'),
  cat_salad AS (SELECT id FROM categories WHERE slug = 'salad'),
  cat_moimoi AS (SELECT id FROM categories WHERE slug = 'moimoi'),
  cat_spaghetti AS (SELECT id FROM categories WHERE slug = 'spaghetti')
INSERT INTO menu_items
  (category_id, name, slug, description, price, image_url, gallery, ingredients, nutrition_info, prep_time, rating, review_count, is_popular, is_available, sort_order)
VALUES
  (
    (SELECT id FROM cat_jollof),
    'Jollof Rice + Chicken',
    'jollof-rice-chicken',
    'Classic Nigerian party-style jollof rice served with fried plantain and grilled chicken.',
    4500.00,
    '/images/categories/image.png',
    ARRAY['/images/categories/image.png'],
    ARRAY['Rice','Tomato','Pepper','Chicken','Plantain'],
    '{"calories":"650 kcal","protein":"28g","carbs":"75g","fat":"18g"}'::jsonb,
    '20-30 mins',
    4.9,
    128,
    true,
    true,
    1
  ),
  (
    (SELECT id FROM cat_fried),
    'Fried Rice + Turkey',
    'fried-rice-turkey',
    'Flavorful vegetable fried rice served with roasted turkey.',
    5000.00,
    '/images/categories/image copy 2.png',
    ARRAY['/images/categories/image copy 2.png'],
    ARRAY['Rice','Vegetables','Carrot','Peas','Turkey'],
    '{"calories":"700 kcal","protein":"32g","carbs":"80g","fat":"20g"}'::jsonb,
    '20-30 mins',
    4.8,
    96,
    true,
    true,
    2
  ),
  (
    (SELECT id FROM cat_chicken),
    'Peppered Chicken',
    'peppered-chicken',
    'Spicy, herb-marinated grilled chicken in rich pepper sauce.',
    3800.00,
    'https://images.pexels.com/photos/37081053/pexels-photo-37081053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/37081053/pexels-photo-37081053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Chicken','Pepper','Onion','Spices'],
    '{"calories":"420 kcal","protein":"48g","carbs":"4g","fat":"24g"}'::jsonb,
    '15-20 mins',
    4.8,
    89,
    true,
    true,
    3
  ),
  (
    (SELECT id FROM cat_fish),
    'Catfish Pepper Soup',
    'catfish-pepper-soup',
    'Fresh catfish simmered in spicy, aromatic pepper soup broth.',
    6500.00,
    '/images/categories/image copy.png',
    ARRAY['/images/categories/image copy.png'],
    ARRAY['Catfish','Pepper','Scent leaf','Spices'],
    '{"calories":"380 kcal","protein":"42g","carbs":"8g","fat":"18g"}'::jsonb,
    '25-35 mins',
    4.7,
    64,
    true,
    true,
    4
  ),
  (
    (SELECT id FROM cat_fish),
    'Seafood Platter',
    'seafood-platter',
    'Premium seafood platter with prawns, fish, and calamari.',
    12000.00,
    '/images/categories/image copy.png',
    ARRAY['/images/categories/image copy.png'],
    ARRAY['Prawns','Fish','Calamari','Pepper','Lemon'],
    '{"calories":"580 kcal","protein":"52g","carbs":"12g","fat":"32g"}'::jsonb,
    '30-40 mins',
    4.9,
    47,
    true,
    true,
    5
  ),
  (
    (SELECT id FROM cat_chicken),
    'Special Shawarma',
    'special-shawarma',
    'Loaded chicken shawarma with vegetables and special sauce.',
    3500.00,
    'https://images.pexels.com/photos/37417613/pexels-photo-37417613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/37417613/pexels-photo-37417613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Chicken','Lettuce','Tomato','Garlic sauce','Wrap'],
    '{"calories":"520 kcal","protein":"28g","carbs":"45g","fat":"24g"}'::jsonb,
    '10-15 mins',
    4.7,
    112,
    true,
    true,
    6
  ),
  (
    (SELECT id FROM cat_chicken),
    'Small Chops Package',
    'small-chops-package',
    'Assorted small chops: samosa, spring rolls, puff puff, and chicken.',
    4000.00,
    'https://images.pexels.com/photos/29843061/pexels-photo-29843061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/29843061/pexels-photo-29843061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Samosa','Spring rolls','Puff puff','Chicken'],
    '{"calories":"680 kcal","protein":"20g","carbs":"58g","fat":"36g"}'::jsonb,
    '15-20 mins',
    4.6,
    83,
    true,
    true,
    7
  ),
  (
    (SELECT id FROM cat_salad),
    'Fresh Fruit Juice',
    'fresh-fruit-juice',
    'Refreshing blend of fresh seasonal fruits.',
    2000.00,
    'https://images.pexels.com/photos/10665501/pexels-photo-10665501.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/10665501/pexels-photo-10665501.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Orange','Pineapple','Watermelon','Ginger'],
    '{"calories":"180 kcal","protein":"3g","carbs":"42g","fat":"1g"}'::jsonb,
    '5-10 mins',
    4.5,
    56,
    true,
    true,
    8
  ),
  (
    (SELECT id FROM cat_chicken),
    'Beef Burger Deluxe',
    'beef-burger-deluxe',
    'Juicy beef patty with cheese, lettuce, tomato, and special sauce.',
    5500.00,
    'https://images.pexels.com/photos/17212202/pexels-photo-17212202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/17212202/pexels-photo-17212202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Beef','Cheese','Lettuce','Tomato','Bun'],
    '{"calories":"720 kcal","protein":"34g","carbs":"48g","fat":"38g"}'::jsonb,
    '15-20 mins',
    4.7,
    72,
    true,
    true,
    9
  ),
  (
    (SELECT id FROM cat_fish),
    'Grilled Fish Special',
    'grilled-fish-special',
    'Whole grilled fish with pepper sauce and vegetables.',
    8000.00,
    '/images/categories/image copy.png',
    ARRAY['/images/categories/image copy.png'],
    ARRAY['Fish','Pepper','Onion','Vegetables'],
    '{"calories":"440 kcal","protein":"46g","carbs":"8g","fat":"24g"}'::jsonb,
    '25-35 mins',
    4.8,
    58,
    true,
    true,
    10
  ),
  (
    (SELECT id FROM cat_turkey),
    'Roasted Turkey Special',
    'roasted-turkey-special',
    'Glazed roasted turkey with herbs and side sauce.',
    7000.00,
    'https://images.pexels.com/photos/14560071/pexels-photo-14560071.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/14560071/pexels-photo-14560071.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Turkey','Herbs','Glaze','Spices'],
    '{"calories":"480 kcal","protein":"52g","carbs":"6g","fat":"26g"}'::jsonb,
    '20-30 mins',
    4.7,
    41,
    false,
    true,
    11
  ),
  (
    (SELECT id FROM cat_salad),
    'Grilled Chicken Salad',
    'grilled-chicken-salad',
    'Fresh garden salad with grilled chicken and light dressing.',
    4500.00,
    'https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Lettuce','Tomato','Cucumber','Chicken','Dressing'],
    '{"calories":"320 kcal","protein":"30g","carbs":"14g","fat":"16g"}'::jsonb,
    '10-15 mins',
    4.6,
    38,
    false,
    true,
    12
  ),
  (
    (SELECT id FROM cat_spaghetti),
    'Spaghetti Bolognese',
    'spaghetti-bolognese',
    'Spaghetti in rich tomato meat sauce with herbs.',
    4500.00,
    '/images/categories/image copy 4.png',
    ARRAY['/images/categories/image copy 4.png'],
    ARRAY['Spaghetti','Beef','Tomato','Onion','Herbs'],
    '{"calories":"580 kcal","protein":"26g","carbs":"72g","fat":"18g"}'::jsonb,
    '15-25 mins',
    4.6,
    44,
    false,
    true,
    13
  ),
  (
    (SELECT id FROM cat_moimoi),
    'Steamed Moimoi',
    'steamed-moimoi',
    'Traditional steamed beans pudding with egg and fish.',
    2500.00,
    '/images/categories/image copy 3.png',
    ARRAY['/images/categories/image copy 3.png'],
    ARRAY['Beans','Pepper','Onion','Egg'],
    '{"calories":"320 kcal","protein":"18g","carbs":"38g","fat":"10g"}'::jsonb,
    '30-40 mins',
    4.5,
    29,
    false,
    true,
    14
  ),
  (
    (SELECT id FROM cat_jollof),
    'Jollof Rice + Fish',
    'jollof-rice-fish',
    'Classic Nigerian jollof rice served with grilled fish.',
    5500.00,
    '/images/categories/image.png',
    ARRAY['/images/categories/image.png'],
    ARRAY['Rice','Tomato','Pepper','Fish','Plantain'],
    '{"calories":"620 kcal","protein":"32g","carbs":"70g","fat":"20g"}'::jsonb,
    '20-30 mins',
    4.7,
    51,
    false,
    true,
    15
  );
