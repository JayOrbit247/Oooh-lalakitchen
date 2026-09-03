/*
# Revert menu to original categories and items

1. Overview
- Removes the "Oooh-Lala Menu" single category and all 18 new menu items.
- Restores the original 8 categories (Jollof Rice, Fried Rice, Turkey, Chicken,
  Fish, Salad, Moimoi, Spaghetti) with their original sort order.
- Restores the original 15 menu items with original names, slugs, prices,
  images, descriptions, ingredients, and metadata.

2. Tables affected
- menu_items: all current rows deleted, 15 original rows re-inserted.
- categories: all current rows deleted, 8 original rows re-inserted.

3. Security
- No policy changes. Existing public-read policies remain in effect.

4. Important notes
- This reverts the menu replacement migration to restore the prior state.
*/

-- Delete all current menu items
DELETE FROM menu_items;

-- Delete all current categories
DELETE FROM categories;

-- Restore original 8 categories
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active)
VALUES
  ('Jollof Rice', 'jollof-rice', 'Classic Nigerian party-style jollof rice', 'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1, true),
  ('Fried Rice', 'fried-rice', 'Flavorful vegetable fried rice', 'https://images.pexels.com/photos/37241099/pexels-photo-37241099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2, true),
  ('Turkey', 'turkey', 'Glazed and roasted turkey', 'https://images.pexels.com/photos/14560071/pexels-photo-14560071.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3, true),
  ('Chicken', 'chicken', 'Juicy grilled chicken', 'https://images.pexels.com/photos/37081053/pexels-photo-37081053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4, true),
  ('Fish', 'fish', 'Fried and grilled fish specialties', 'https://images.pexels.com/photos/15954348/pexels-photo-15954348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5, true),
  ('Salad', 'salad', 'Fresh garden salads', 'https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6, true),
  ('Moimoi', 'moimoi', 'Traditional steamed bean pudding', 'https://images.pexels.com/photos/37648018/pexels-photo-37648018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 7, true),
  ('Spaghetti', 'spaghetti', 'Spicy stir-fried spaghetti', 'https://images.pexels.com/photos/36430170/pexels-photo-36430170.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 8, true);

-- Restore original 15 menu items
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
    'https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/17952748/pexels-photo-17952748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/37241099/pexels-photo-37241099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/37241099/pexels-photo-37241099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/2365949/pexels-photo-2365949.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/2365949/pexels-photo-2365949.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/8953719/pexels-photo-8953719.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/8953719/pexels-photo-8953719.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/15954348/pexels-photo-15954348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/15954348/pexels-photo-15954348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/36430170/pexels-photo-36430170.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/36430170/pexels-photo-36430170.jpeg?auto=compress&cs=tinysrgb&h=650&w=940','https://images.pexels.com/photos/26207761/pexels-photo-26207761.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'Traditional steamed bean pudding with egg and fish.',
    2500.00,
    'https://images.pexels.com/photos/37648018/pexels-photo-37648018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/37648018/pexels-photo-37648018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
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
    'https://images.pexels.com/photos/17952748/pexels-photo-17952748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ARRAY['https://images.pexels.com/photos/17952748/pexels-photo-17952748.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    ARRAY['Rice','Tomato','Pepper','Fish','Plantain'],
    '{"calories":"620 kcal","protein":"32g","carbs":"70g","fat":"20g"}'::jsonb,
    '20-30 mins',
    4.7,
    51,
    false,
    true,
    15
  );
