-- =============================================================================
-- DCS Dental - SQL Data Seeding Script (25 Premium Products with Real Images)
-- Seeds Categories, Brands, Products, Images, Details, and Promo Codes.
-- =============================================================================

-- Clean up existing product and promotion tables to prevent duplicate key errors
-- and ensure a clean starting state.
TRUNCATE TABLE products_productdetail CASCADE;
TRUNCATE TABLE products_productimage CASCADE;
TRUNCATE TABLE products_product CASCADE;
TRUNCATE TABLE products_category CASCADE;
TRUNCATE TABLE products_brand CASCADE;
TRUNCATE TABLE promotions_promocode CASCADE;

-- 1. Insert Brands
INSERT INTO products_brand (name, slug, is_active, created_at) VALUES
('DentaPro', 'dentapro', TRUE, NOW()),
('MediTech', 'meditech', TRUE, NOW()),
('OrisLine', 'orisline', TRUE, NOW()),
('ProsthoLab', 'prostholab', TRUE, NOW()),
('CleanDent', 'cleandent', TRUE, NOW()),
('RadioMax', 'radiomax', TRUE, NOW());

-- 2. Insert Categories with Real Images
INSERT INTO products_category (name, slug, description, image, is_active, created_at, updated_at) VALUES
(
  'Instruments', 
  'instruments', 
  'Instruments dentaires professionnels pour cabinets.', 
  'https://images.unsplash.com/photo-1579721591244-6926958264b7?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Consommables', 
  'consommables', 
  'Fournitures, composites, gants et consommables du quotidien.', 
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Prothèse', 
  'prothese', 
  'Matériel et résines pour laboratoires de prothèse.', 
  'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Rotatifs', 
  'rotatifs', 
  'Turbines, contre-angles, micromoteurs et pièces à main.', 
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Hygiène & Stérilisation', 
  'hygiene', 
  'Autoclaves, bacs à ultrasons et produits de désinfection.', 
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Imagerie', 
  'imagerie', 
  'Radiologie intra-orale, capteurs RVG et accessoires d''imagerie.', 
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Anesthésie', 
  'anesthesie', 
  'Seringues d''anesthésie, aiguilles et accessoires.', 
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
),
(
  'Mobilier', 
  'mobilier', 
  'Fauteuils dentaires, tabourets et mobilier clinique.', 
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop', 
  TRUE, 
  NOW(), 
  NOW()
);

-- 3. Insert Products (1 to 25)

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

-- Product 9: Seringue d'anesthésie métallique
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Seringue d''anesthésie métallique',
  'seringue-anesthesie-metallique',
  75.000,
  NULL,
  'Seringue d''anesthésie métallique d''aspiration manuelle de haute qualité pour cartouches d''anesthésiques standard. Robuste, durable et entièrement autoclavable.',
  15,
  50,
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'DentaPro'),
  (SELECT id FROM products_category WHERE slug = 'anesthesie')
);

-- Product 10: Fauteuil dentaire ergonomique Premium
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Fauteuil dentaire ergonomique Premium',
  'fauteuil-dentaire-ergonomique-premium',
  8900.000,
  9800.000,
  'Fauteuil dentaire ergonomique avec revêtement en simili cuir sans couture. Dispose de mouvements électriques silencieux préprogrammables, d''un pédalier de commande et d''une garantie constructeur.',
  2,
  5,
  FALSE,
  TRUE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'OrisLine'),
  (SELECT id FROM products_category WHERE slug = 'mobilier')
);

-- Product 11: Miroir buccal dentaire n°4 (Pack de 10)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Miroir buccal dentaire n°4 (Pack de 10)',
  'miroir-buccal-dentaire-n4',
  42.000,
  NULL,
  'Pack de 10 miroirs buccaux plats n°4 avec revêtement en verre rhodié anti-reflet pour une clarté visuelle exceptionnelle. Résistant aux cycles de stérilisation répétés.',
  35,
  100,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'instruments')
);

-- Product 12: Aiguilles pour anesthésie 30G (boîte de 100)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Aiguilles pour anesthésie 30G (boîte de 100)',
  'aiguilles-anesthesie-30g',
  29.000,
  NULL,
  'Aiguilles d''anesthésie dentaire stérile à usage unique de calibre 30G (0.3 x 21mm). Biseau triplement affûté pour réduire la douleur à l''insertion.',
  60,
  120,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'MediTech'),
  (SELECT id FROM products_category WHERE slug = 'anesthesie')
);

-- Product 13: Détartreur ultrasonique piezo-électrique
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Détartreur ultrasonique piezo-électrique',
  'detartreur-ultrasonique-piezo-electrique',
  850.000,
  NULL,
  'Détartreur ultrasonique piezo-électrique avec pièce à main détachable et autoclavable à 134°C. Livré complet avec 5 inserts de détartrage différents et clé dynamométrique.',
  8,
  20,
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'DentaPro'),
  (SELECT id FROM products_category WHERE slug = 'rotatifs')
);

-- Product 14: Sondes d'exploration dentaire double (pack de 5)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Sondes d''exploration dentaire double (pack de 5)',
  'sondes-exploration-dentaire-double',
  65.000,
  NULL,
  'Pack de 5 sondes d''exploration dentaire à double extrémité (n''9 et n''17). Fabriquées en acier inoxydable de qualité chirurgicale avec manche ergonomique strié.',
  25,
  75,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'instruments')
);

-- Product 15: Alginate de prise rapide pour empreintes (500g)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Alginate de prise rapide pour empreintes (500g)',
  'alginate-prise-rapide-empreintes',
  35.000,
  NULL,
  'Alginate sans poussière à prise rapide pour la réalisation d''empreintes dentaires de haute fidélité. Changement de couleur chromatique pour guider le praticien pendant les phases.',
  50,
  150,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'ProsthoLab'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);

-- Product 16: Ciment de scellement verre ionomère
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Ciment de scellement verre ionomère',
  'ciment-scellement-verre-ionomere',
  185.000,
  NULL,
  'Ciment de scellement définitif verre ionomère photopolymérisable. Idéal pour couronnes, ponts, inlays, onlays et attaches orthodontiques. Excellente adhésion chimique à la dentine.',
  18,
  50,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'MediTech'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);

-- Product 17: Plâtre synthétique classe IV pour modèles (5kg)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Plâtre synthétique classe IV pour modèles (5kg)',
  'platre-synthetique-classe-iv',
  95.000,
  110.000,
  'Plâtre synthétique de classe IV à haute résistance pour la coulée de modèles de précision et matrices de laboratoires. Faible expansion de prise et haute résistance à la compression.',
  14,
  40,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'ProsthoLab'),
  (SELECT id FROM products_category WHERE slug = 'prothese')
);

-- Product 18: Bac à ultrasons de nettoyage 3L
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Bac à ultrasons de nettoyage 3L',
  'bac-ultrasons-nettoyage-3l',
  420.000,
  NULL,
  'Nettoyeur à ultrasons d''une capacité de 3 litres avec chauffage de l''eau réglable jusqu''à 80°C et minuterie numérique. Permet de désincruster les résidus sur l''instrumentation clinique.',
  10,
  25,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'hygiene')
);

-- Product 19: Négatoscope plat à LED A4
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Négatoscope plat à LED A4',
  'negatoscope-plat-led-a4',
  290.000,
  NULL,
  'Négatoscope ultra-plat d''une épaisseur de 12 mm au format A4. Éclairage LED homogène à haute luminosité réglable pour l''analyse des clichés radiographiques analogiques.',
  5,
  15,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'RadioMax'),
  (SELECT id FROM products_category WHERE slug = 'imagerie')
);

-- Product 20: Tabouret de praticien ergonomique
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Tabouret de praticien ergonomique',
  'tabouret-praticien-ergonomique',
  380.000,
  450.000,
  'Tabouret de cabinet ergonomique pour dentiste ou assistant. Hauteur réglable par vérin à gaz, piètement en aluminium poli à 5 branches et dossier pivotant.',
  7,
  20,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'OrisLine'),
  (SELECT id FROM products_category WHERE slug = 'mobilier')
);

-- Product 21: Bandelette de blanchiment dentaire (pack de 28)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Bandelette de blanchiment dentaire (pack de 28)',
  'bandelette-blanchiment-dentaire',
  89.000,
  NULL,
  'Bandelettes de blanchiment dentaire sans peroxyde à usage domestique ou professionnel. Traitement complet de 14 jours pour des dents visiblement plus blanches.',
  40,
  100,
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);

-- Product 22: Contre-angle multiplicateur 1:5 LED
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Contre-angle multiplicateur 1:5 LED',
  'contre-angle-multiplicateur-1-5-led',
  1450.000,
  1680.000,
  'Contre-angle multiplicateur rouge 1:5 avec technologie d''éclairage LED intégrée. Tête compacte, quadruple spray d''eau et vitesse de rotation élevée jusqu''à 200 000 tr/min.',
  6,
  15,
  FALSE,
  TRUE,
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'DentaPro'),
  (SELECT id FROM products_category WHERE slug = 'rotatifs')
);

-- Product 23: Caméra intra-orale HD sans fil
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Caméra intra-orale HD sans fil',
  'camera-intra-orale-hd-sans-fil',
  1120.000,
  NULL,
  'Caméra intra-orale sans fil haute définition 1080p avec connexion WiFi. Dotée de 6 LED blanches réglables et d''une lentille macro à mise au point automatique.',
  9,
  25,
  TRUE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'RadioMax'),
  (SELECT id FROM products_category WHERE slug = 'imagerie')
);

-- Product 24: Autoclave de stérilisation 23L classe B
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Autoclave de stérilisation 23L classe B',
  'autoclave-sterilisation-23l',
  5890.000,
  6500.000,
  'Autoclave de grande capacité de 23 litres de classe B. Idéal pour stériliser des charges volumineuses et des instruments creux ou enveloppés de manière fiable et rapide.',
  3,
  10,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'CleanDent'),
  (SELECT id FROM products_category WHERE slug = 'hygiene')
);

-- Product 25: Canules d'aspiration chirurgicale (pack de 100)
INSERT INTO products_product (name, slug, price, old_price, description, stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at, brand_id, category_id) VALUES
(
  'Canules d''aspiration chirurgicale (pack de 100)',
  'canules-aspiration-chirurgicale',
  38.000,
  NULL,
  'Boîte de 100 canules d''aspiration chirurgicale jetables de diamètre 11 mm. Embouts biseautés sans arêtes vives pour un confort maximal du patient.',
  80,
  200,
  FALSE,
  FALSE,
  FALSE,
  TRUE,
  NOW(),
  NOW(),
  (SELECT id FROM products_brand WHERE name = 'MediTech'),
  (SELECT id FROM products_category WHERE slug = 'consommables')
);


-- 4. Insert Product Images (Using Real Public Unsplash URLs)
INSERT INTO products_productimage (image, alt_text, is_primary, "order", product_id) VALUES
-- P1
('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop', 'Micromoteur électrique sans fil', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'micromoteur-electrique-sans-fil')),
-- P2
('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', 'Composite photopolymérisable A2 kit', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'composite-photopolymerisable-a2')),
-- P3
('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', 'Autoclave de stérilisation 18L classe B', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-18l')),
-- P4
('https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=600&auto=format&fit=crop', 'Kit fraises diamantées', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'kit-fraises-diamantees')),
-- P5
('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop', 'Résine acrylique pour prothèse', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'resine-acrylique-prothese')),
-- P6
('https://images.unsplash.com/photo-1579684389782-64d84b5e9053?q=80&w=600&auto=format&fit=crop', 'Lampe à photopolymériser LED', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'lampe-photopolymeriser-led')),
-- P7
('https://images.unsplash.com/photo-1599493759991-4f1589a8031c?q=80&w=600&auto=format&fit=crop', 'Gants nitrile non poudrés', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'gants-nitrile-non-poudres')),
-- P8
('https://images.unsplash.com/photo-1579684453401-966b11812b77?q=80&w=600&auto=format&fit=crop', 'Radiographie capteur numérique RVG', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg')),
-- P9
('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop', 'Seringue d''anesthésie métallique', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'seringue-anesthesie-metallique')),
-- P10
('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop', 'Fauteuil dentaire ergonomique Premium', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'fauteuil-dentaire-ergonomique-premium')),
-- P11
('https://images.unsplash.com/photo-1579684389782-64d84b5e9053?q=80&w=600&auto=format&fit=crop', 'Miroir buccal dentaire n°4', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'miroir-buccal-dentaire-n4')),
-- P12
('https://images.unsplash.com/photo-1615461066870-40b120f26e5d?q=80&w=600&auto=format&fit=crop', 'Aiguilles pour anesthésie 30G', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'aiguilles-anesthesie-30g')),
-- P13
('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop', 'Détartreur ultrasonique piezo-électrique', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'detartreur-ultrasonique-piezo-electrique')),
-- P14
('https://images.unsplash.com/photo-1579684389782-64d84b5e9053?q=80&w=600&auto=format&fit=crop', 'Sondes d''exploration dentaire double', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'sondes-exploration-dentaire-double')),
-- P15
('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop', 'Alginate de prise rapide pour empreintes', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'alginate-prise-rapide-empreintes')),
-- P16
('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', 'Ciment de scellement verre ionomère', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'ciment-scellement-verre-ionomere')),
-- P17
('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop', 'Plâtre synthétique classe IV pour modèles', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'platre-synthetique-classe-iv')),
-- P18
('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', 'Bac à ultrasons de nettoyage 3L', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'bac-ultrasons-nettoyage-3l')),
-- P19
('https://images.unsplash.com/photo-1579684453401-966b11812b77?q=80&w=600&auto=format&fit=crop', 'Négatoscope plat à LED A4', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'negatoscope-plat-led-a4')),
-- P20
('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=600&auto=format&fit=crop', 'Tabouret de praticien ergonomique', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'tabouret-praticien-ergonomique')),
-- P21
('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', 'Bandelette de blanchiment dentaire', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'bandelette-blanchiment-dentaire')),
-- P22
('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop', 'Contre-angle multiplicateur 1:5 LED', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'contre-angle-multiplicateur-1-5-led')),
-- P23
('https://images.unsplash.com/photo-1579684453401-966b11812b77?q=80&w=600&auto=format&fit=crop', 'Caméra intra-orale HD sans fil', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'camera-intra-orale-hd-sans-fil')),
-- P24
('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', 'Autoclave de stérilisation 23L classe B', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-23l')),
-- P25
('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop', 'Canules d''aspiration chirurgicale', TRUE, 0, (SELECT id FROM products_product WHERE slug = 'canules-aspiration-chirurgicale'));


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
('Garantie', '2 ans', (SELECT id FROM products_product WHERE slug = 'capteur-numerique-rvg')),

('Type', 'Aspiration manuelle', (SELECT id FROM products_product WHERE slug = 'seringue-anesthesie-metallique')),
('Matière', 'Acier inoxydable', (SELECT id FROM products_product WHERE slug = 'seringue-anesthesie-metallique')),
('Stérilisable', 'Oui (autoclave)', (SELECT id FROM products_product WHERE slug = 'seringue-anesthesie-metallique')),

('Revêtement', 'Simili cuir sans couture', (SELECT id FROM products_product WHERE slug = 'fauteuil-dentaire-ergonomique-premium')),
('Mouvements', 'Électrique silencieux', (SELECT id FROM products_product WHERE slug = 'fauteuil-dentaire-ergonomique-premium')),
('Garantie', '3 ans', (SELECT id FROM products_product WHERE slug = 'fauteuil-dentaire-ergonomique-premium')),

('Diamètre', '22 mm', (SELECT id FROM products_product WHERE slug = 'miroir-buccal-dentaire-n4')),
('Matière', 'Verre rhodié anti-reflet', (SELECT id FROM products_product WHERE slug = 'miroir-buccal-dentaire-n4')),
('Conditionnement', 'Boîte de 10', (SELECT id FROM products_product WHERE slug = 'miroir-buccal-dentaire-n4')),

('Calibre', '30G (0.3 x 21mm)', (SELECT id FROM products_product WHERE slug = 'aiguilles-anesthesie-30g')),
('Quantité', '100 aiguilles / boîte', (SELECT id FROM products_product WHERE slug = 'aiguilles-anesthesie-30g')),
('Usage', 'Unique (stérile)', (SELECT id FROM products_product WHERE slug = 'aiguilles-anesthesie-30g')),

('Fréquence', '28 kHz - 30 kHz', (SELECT id FROM products_product WHERE slug = 'detartreur-ultrasonique-piezo-electrique')),
('Pièce à main', 'Autoclavable 134°C', (SELECT id FROM products_product WHERE slug = 'detartreur-ultrasonique-piezo-electrique')),
('Inserts inclus', '5 pièces', (SELECT id FROM products_product WHERE slug = 'detartreur-ultrasonique-piezo-electrique')),

('Type', 'Double extrémité (n°9/17)', (SELECT id FROM products_product WHERE slug = 'sondes-exploration-dentaire-double')),
('Matière', 'Acier inoxydable', (SELECT id FROM products_product WHERE slug = 'sondes-exploration-dentaire-double')),
('Conditionnement', 'Pack de 5', (SELECT id FROM products_product WHERE slug = 'sondes-exploration-dentaire-double')),

('Poids', '500 g', (SELECT id FROM products_product WHERE slug = 'alginate-prise-rapide-empreintes')),
('Prise', 'Rapide (3min)', (SELECT id FROM products_product WHERE slug = 'alginate-prise-rapide-empreintes')),
('Couleur', 'Changement chromatique', (SELECT id FROM products_product WHERE slug = 'alginate-prise-rapide-empreintes')),

('Type', 'Verre ionomère photopolymérisable', (SELECT id FROM products_product WHERE slug = 'ciment-scellement-verre-ionomere')),
('Teinte', 'Universelle', (SELECT id FROM products_product WHERE slug = 'ciment-scellement-verre-ionomere')),
('Contenu', 'Poudre 15g + Liquide 8ml', (SELECT id FROM products_product WHERE slug = 'ciment-scellement-verre-ionomere')),

('Poids', '5 kg', (SELECT id FROM products_product WHERE slug = 'platre-synthetique-classe-iv')),
('Classe', 'IV (Haute résistance)', (SELECT id FROM products_product WHERE slug = 'platre-synthetique-classe-iv')),
('Mélange', '20ml eau / 100g plâtre', (SELECT id FROM products_product WHERE slug = 'platre-synthetique-classe-iv')),

('Capacité', '3 Litres', (SELECT id FROM products_product WHERE slug = 'bac-ultrasons-nettoyage-3l')),
('Puissance', '120 W (ultrasons)', (SELECT id FROM products_product WHERE slug = 'bac-ultrasons-nettoyage-3l')),
('Chauffage', 'Jusqu''à 80°C', (SELECT id FROM products_product WHERE slug = 'bac-ultrasons-nettoyage-3l')),

('Format', 'A4', (SELECT id FROM products_product WHERE slug = 'negatoscope-plat-led-a4')),
('Technologie', 'LED ultra-plat', (SELECT id FROM products_product WHERE slug = 'negatoscope-plat-led-a4')),
('Luminosité', 'Réglable', (SELECT id FROM products_product WHERE slug = 'negatoscope-plat-led-a4')),

('Hauteur réglable', '48 - 65 cm', (SELECT id FROM products_product WHERE slug = 'tabouret-praticien-ergonomique')),
('Piétement', 'Aluminium 5 branches', (SELECT id FROM products_product WHERE slug = 'tabouret-praticien-ergonomique')),
('Dossier', 'Ergonomique pivotant', (SELECT id FROM products_product WHERE slug = 'tabouret-praticien-ergonomique')),

('Durée du traitement', '14 jours', (SELECT id FROM products_product WHERE slug = 'bandelette-blanchiment-dentaire')),
('Technologie', 'Sans peroxyde', (SELECT id FROM products_product WHERE slug = 'bandelette-blanchiment-dentaire')),
('Conditionnement', '28 bandelettes', (SELECT id FROM products_product WHERE slug = 'bandelette-blanchiment-dentaire')),

('Vitesse max', '200 000 tr/min', (SELECT id FROM products_product WHERE slug = 'contre-angle-multiplicateur-1-5-led')),
('Spray', 'Quadruple spray d''eau', (SELECT id FROM products_product WHERE slug = 'contre-angle-multiplicateur-1-5-led')),
('Lumière', 'Barre de verre LED', (SELECT id FROM products_product WHERE slug = 'contre-angle-multiplicateur-1-5-led')),

('Résolution', '1080p Full HD', (SELECT id FROM products_product WHERE slug = 'camera-intra-orale-hd-sans-fil')),
('Zoom', '10x optique/numérique', (SELECT id FROM products_product WHERE slug = 'camera-intra-orale-hd-sans-fil')),
('Batterie', '800 mAh rechargeable', (SELECT id FROM products_product WHERE slug = 'camera-intra-orale-hd-sans-fil')),

('Capacité', '23 Litres', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-23l')),
('Poids net', '55 kg', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-23l')),
('Cycle rapide', '20 min', (SELECT id FROM products_product WHERE slug = 'autoclave-sterilisation-23l')),

('Diamètre', '11 mm', (SELECT id FROM products_product WHERE slug = 'canules-aspiration-chirurgicale')),
('Conditionnement', 'Boîte de 100', (SELECT id FROM products_product WHERE slug = 'canules-aspiration-chirurgicale')),
('Matière', 'Plastique médical recyclable', (SELECT id FROM products_product WHERE slug = 'canules-aspiration-chirurgicale'));


-- 6. Insert Promo Codes (Coupons)
INSERT INTO promotions_promocode (code, description, discount_percentage, min_order_amount, max_uses, times_used, is_active, expires_at, created_at, category_id) VALUES
('DCS10', '10% sur toute la commande', 10.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), NULL),
('PROTHESE15', '15% sur la catégorie Prothèse', 15.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), (SELECT id FROM products_category WHERE slug = 'prothese')),
('ETUDIANT20', '20% tarif étudiant', 20.00, 0.000, 0, 0, TRUE, '2027-12-31 23:59:59+01', NOW(), NULL);
