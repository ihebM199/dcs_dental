-- =============================================================================
-- DCS Dental - SQL Data Seeding Script
-- Seeds Categories, Brands, Products, Images, Details, and Promo Codes.
-- =============================================================================
-- Clean up existing product and promotion tables without deleting orders.
UPDATE orders_order SET promo_code_id = NULL WHERE promo_code_id IS NOT NULL;
UPDATE orders_orderitem SET product_id = NULL WHERE product_id IS NOT NULL;

DELETE FROM products_productdetail;
DELETE FROM products_productimage;
DELETE FROM promotions_promocode;
DELETE FROM products_product;
DELETE FROM products_category;
DELETE FROM products_brand;
-- 1. Insert Brands
INSERT INTO products_brand (name, slug, is_active, created_at) VALUES
('DentaPro', 'dentapro', TRUE, NOW()),
('MediTech', 'meditech', TRUE, NOW()),
('OrisLine', 'orisline', TRUE, NOW()),
('ProsthoLab', 'prostholab', TRUE, NOW()),
('CleanDent', 'cleandent', TRUE, NOW()),
('RadioMax', 'radiomax', TRUE, NOW());
-- 2. Insert Categories
INSERT INTO products_category (name, slug, description, is_active, created_at, updated_at) VALUES
('Instruments', 'instruments', 'Instruments dentaires professionnels pour cabinets.', TRUE, NOW(), NOW()),
('Consommables', 'consommables', 'Fournitures, composites, gants et consommables du quotidien.', TRUE, NOW(), NOW()),
('Prothèse', 'prothese', 'Matériel et résines pour laboratoires de prothèse.', TRUE, NOW(), NOW()),
('Rotatifs', 'rotatifs', 'Turbines, contre-angles, micromoteurs et pièces à main.', TRUE, NOW(), NOW()),
('Hygiène & Stérilisation', 'hygiene', 'Autoclaves, bacs à ultrasons et produits de désinfection.', TRUE, NOW(), NOW()),
('Imagerie', 'imagerie', 'Radiologie intra-orale, capteurs RVG et accessoires d''imagerie.', TRUE, NOW(), NOW()),
('Anesthésie', 'anesthesie', 'Seringues d''anesthésie, aiguilles et accessoires.', TRUE, NOW(), NOW()),
('Mobilier', 'mobilier', 'Fauteuils dentaires, tabourets et mobilier clinique.', TRUE, NOW(), NOW());
-- 3. Insert Products
-- Product 1: Micromoteur électrique sans fil
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Micromoteur électrique sans fil',
  'micromoteur-electrique-sans-fil',
  1290.000,
  1590.000,
  'Micromoteur électrique sans fil haute précision avec contrôle de couple numérique, idéal pour les procédures d''endodontie et de prothèse. Batterie longue durée et ergonomie optimisée.',
  4,
  40,
  FALSE,
  TRUE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'DentaPro'),
  (SELECT id FROM products_category WHERE slug = 'rotatifs')
);
-- Product 2: Composite photopolymérisable A2 (kit)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Composite photopolymérisable A2 (kit)',
  'composite-photopolymerisable-a2',
  320.000,
  NULL,
  'Composite nano-hybride photopolymérisable teinte A2, esthétique et résistant. Excellente manipulation et polissage durable pour restaurations antérieures et postérieures.',
  22,
  50,
  FALSE,
  FALSE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'MediTech'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);
-- Product 3: Autoclave de stérilisation 18L classe B
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Autoclave de stérilisation 18L classe B',
  'autoclave-sterilisation-18l',
  4850.000,
  5400.000,
  'Autoclave classe B 18 litres avec cycles programmables et impression de traçabilité. Conforme aux normes européennes de stérilisation des dispositifs médicaux.',
  28,
  35,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'hygiene')
);
-- Product 4: Kit fraises diamantées (10 pièces)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Kit fraises diamantées (10 pièces)',
  'kit-fraises-diamantees',
  145.000,
  NULL,
  'Assortiment de 10 fraises diamantées de granulométrie variée pour la préparation et la finition. Tige conforme aux turbines standard.',
  12,
  60,
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'OrisLine'),
  (SELECT id FROM products_category WHERE slug = 'rotatifs')
);
-- Product 5: Résine acrylique pour prothèse (500g)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Résine acrylique pour prothèse (500g)',
  'resine-acrylique-prothese',
  410.000,
  480.000,
  'Résine acrylique thermopolymérisable haute résistance pour la fabrication de prothèses dentaires. Teinte stable et finition esthétique de qualité laboratoire.',
  9,
  45,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'ProsthoLab'),
  (SELECT id FROM products_category WHERE slug = 'prothese')
);
-- Product 6: Lampe à photopolymériser LED
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Lampe à photopolymériser LED',
  'lampe-photopolymeriser-led',
  690.000,
  NULL,
  'Lampe LED de photopolymérisation sans fil avec large spectre d''émission et plusieurs modes. Léger, puissant et doté d''un radiomètre intégré.',
  31,
  40,
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'MediTech'),
  (SELECT id FROM products_category WHERE slug = 'instruments')
);
-- Product 7: Gants nitrile non poudrés (boîte 100)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Gants nitrile non poudrés (boîte 100)',
  'gants-nitrile-non-poudres',
  48.000,
  NULL,
  'Gants d''examen en nitrile non poudrés, confortables et résistants. Sans latex, idéaux pour les praticiens et patients sensibles.',
  48,
  80,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);
-- Product 8: Radiographie capteur numérique RVG
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Radiographie capteur numérique RVG',
  'capteur-numerique-rvg',
  7200.000,
  8100.000,
  'Capteur radiographique numérique intra-oral haute résolution, connexion USB plug-and-play. Imagerie nette pour diagnostics précis.',
  6,
  20,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'RadioMax'),
  (SELECT id FROM products_category WHERE slug = 'imagerie')
);
-- 4. Insert Product Images
INSERT INTO products_productimage (image, alt_text, is_primary, "order", product_id) VALUES
('products/micromoteur.png', 'Micromoteur électrique sans fil', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
('products/composite.png', 'Composite photopolymérisable A2 kit', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
('products/autoclave.png', 'Autoclave de stérilisation 18L classe B', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
('products/fraises.png', 'Kit fraises diamantées', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
('products/resine.png', 'Résine acrylique pour prothèse', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
('products/lampe.png', 'Lampe à photopolymériser LED', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
('products/gants.png', 'Gants nitrile non poudrés', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
('products/capteur.png', 'Radiographie capteur numérique RVG', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg'));
-- 5. Insert Product Details (Specifications)
INSERT INTO products_productdetail (label, value, product_id) VALUES
('Vitesse', '200 - 40 000 tr/min', (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
('Couple', 'Jusqu''à 4 Ncm', (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
('Autonomie', 'Environ 4 heures', (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
('Garantie', '2 ans', (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
('Teinte', 'A2 universelle', (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
('Contenu', 'Kit 4 seringues', (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
('Polymérisation', 'LED 20s', (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
('Conservation', '24 mois', (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
('Capacité', '18 litres', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
('Classe', 'B (norme EN 13060)', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
('Cycles', '6 programmes', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
('Garantie', '3 ans', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
('Quantité', '10 fraises', (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
('Grain', 'Fin à gros', (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
('Tige', 'FG 314', (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
('Stérilisable', 'Oui', (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
('Poids', '500 g (poudre)', (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
('Type', 'Thermopolymérisable', (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
('Teinte', 'Rose veiné', (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
('Usage', 'Prothèse complète & partielle', (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
('Puissance', '1200 mW/cm²', (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
('Modes', '3 (standard, rampe, pulse)', (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
('Spectre', '385 - 515 nm', (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
('Autonomie', 'Environ 300 cycles', (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
('Matière', 'Nitrile sans latex', (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
('Quantité', '100 gants / boîte', (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
('Tailles', 'S, M, L, XL', (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
('Norme', 'EN 455', (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
('Résolution', '> 20 lp/mm', (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg')),
('Taille', 'Capteur n°2', (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg')),
('Connexion', 'USB 2.0', (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg')),
('Garantie', '2 ans', (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg'));
-- 6. Insert Promo Codes (Coupons)
INSERT INTO promotions_promocode (code, description, discount_percentage, min_order_amount, max_uses, times_used, is_active, expires_at, created_at, category_id) VALUES
('DCS10', '10% sur toute la commande', 10.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), NULL),
('PROTHESE15', '15% sur la catégorie Prothèse', 15.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), (SELECT id FROM products_category WHERE slug = 'prothese')),
('ETUDIANT20', '20% tarif étudiant', 20.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), NULL);