-- =====================================================================
-- DCS Dental - Script de seed PostgreSQL
-- Compatible avec les modèles Django du projet ihebM199/dcs_dental
-- =====================================================================
-- PRÉREQUIS :
--   1. Avoir créé la base : CREATE DATABASE dcs_dental;
--   2. Avoir lancé : python manage.py migrate
--      (afin que toutes les tables existent)
--   3. Exécuter ce script :
--        psql -U postgres -d dcs_dental -f seed_dcs_dental.sql
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Nettoyage (idempotent) : on vide les tables seed pour pouvoir
-- relancer ce script plusieurs fois sans erreur.
-- ---------------------------------------------------------------------
TRUNCATE TABLE
    products_productdetail,
    products_productimage,
    promotions_promocode,
    products_product,
    products_brand,
    products_category
RESTART IDENTITY CASCADE;

-- =====================================================================
-- 1. CATEGORIES
-- =====================================================================
INSERT INTO products_category (id, name, slug, description, image, is_active, created_at, updated_at) VALUES
(1, 'Instruments',              'instruments',  'Instruments dentaires de précision pour cabinet et laboratoire.',          '', TRUE, NOW(), NOW()),
(2, 'Consommables',             'consommables', 'Consommables à usage unique pour la pratique quotidienne.',                '', TRUE, NOW(), NOW()),
(3, 'Prothèse',                 'prothese',     'Matériaux et fournitures pour la prothèse dentaire.',                      '', TRUE, NOW(), NOW()),
(4, 'Rotatifs',                 'rotatifs',     'Instruments rotatifs : fraises, micromoteurs, contre-angles.',             '', TRUE, NOW(), NOW()),
(5, 'Hygiène & Stérilisation',  'hygiene',      'Équipements et produits pour la stérilisation et l''asepsie.',             '', TRUE, NOW(), NOW()),
(6, 'Imagerie',                 'imagerie',     'Solutions d''imagerie dentaire numérique.',                                '', TRUE, NOW(), NOW()),
(7, 'Anesthésie',               'anesthesie',   'Produits et matériel d''anesthésie locale.',                               '', TRUE, NOW(), NOW()),
(8, 'Mobilier',                 'mobilier',     'Mobilier de cabinet dentaire et accessoires.',                             '', TRUE, NOW(), NOW());

SELECT setval('products_category_id_seq', (SELECT MAX(id) FROM products_category));

-- =====================================================================
-- 2. MARQUES
-- =====================================================================
INSERT INTO products_brand (id, name, slug, logo, is_active, created_at) VALUES
(1, 'DentaPro',   'dentapro',   '', TRUE, NOW()),
(2, 'MediTech',   'meditech',   '', TRUE, NOW()),
(3, 'OrisLine',   'orisline',   '', TRUE, NOW()),
(4, 'ProsthoLab', 'prostholab', '', TRUE, NOW()),
(5, 'CleanDent',  'cleandent',  '', TRUE, NOW()),
(6, 'RadioMax',   'radiomax',   '', TRUE, NOW());

SELECT setval('products_brand_id_seq', (SELECT MAX(id) FROM products_brand));

-- =====================================================================
-- 3. PRODUITS  (prix en TND, 3 décimales)
-- =====================================================================
INSERT INTO products_product
(id, name, slug, brand_id, category_id, price, old_price, description,
 stock, stock_max, is_new, is_promo, is_best_seller, is_active, created_at, updated_at) VALUES

-- ---- Produits du frontend (data.ts) ------------------------------------
(1, 'Micromoteur électrique sans fil', 'micromoteur-electrique-sans-fil', 1, 4,
 1290.000, 1590.000,
 'Micromoteur électrique sans fil haute précision avec contrôle de couple numérique, idéal pour les procédures d''endodontie et de prothèse. Batterie longue durée et ergonomie optimisée.',
 4, 40, FALSE, TRUE, TRUE, TRUE, NOW(), NOW()),

(2, 'Composite photopolymérisable A2 (kit)', 'composite-photopolymerisable-a2', 2, 2,
 320.000, NULL,
 'Composite nano-hybride photopolymérisable teinte A2, esthétique et résistant. Excellente manipulation et polissage durable pour restaurations antérieures et postérieures.',
 22, 50, FALSE, FALSE, TRUE, TRUE, NOW(), NOW()),

(3, 'Autoclave de stérilisation 18L classe B', 'autoclave-sterilisation-18l', 5, 5,
 4850.000, 5400.000,
 'Autoclave classe B 18 litres avec cycles programmables et impression de traçabilité. Conforme aux normes européennes de stérilisation des dispositifs médicaux.',
 28, 35, FALSE, TRUE, FALSE, TRUE, NOW(), NOW()),

(4, 'Kit fraises diamantées (10 pièces)', 'kit-fraises-diamantees', 3, 4,
 145.000, NULL,
 'Assortiment de 10 fraises diamantées de granulométrie variée pour la préparation et la finition. Tige conforme aux turbines standard.',
 12, 60, TRUE, FALSE, FALSE, TRUE, NOW(), NOW()),

(5, 'Résine acrylique pour prothèse (500g)', 'resine-acrylique-prothese', 4, 3,
 410.000, 480.000,
 'Résine acrylique thermopolymérisable haute résistance pour la fabrication de prothèses dentaires. Teinte stable et finition esthétique de qualité laboratoire.',
 9, 45, FALSE, TRUE, FALSE, TRUE, NOW(), NOW()),

(6, 'Lampe à photopolymériser LED', 'lampe-photopolymeriser-led', 2, 1,
 690.000, NULL,
 'Lampe LED de photopolymérisation sans fil avec large spectre d''émission et plusieurs modes. Léger, puissant et doté d''un radiomètre intégré.',
 31, 40, TRUE, FALSE, TRUE, TRUE, NOW(), NOW()),

(7, 'Gants nitrile non poudrés (boîte 100)', 'gants-nitrile-non-poudres', 5, 2,
 48.000, NULL,
 'Gants d''examen en nitrile non poudrés, confortables et résistants. Sans latex, idéaux pour les praticiens et patients sensibles.',
 48, 80, FALSE, FALSE, FALSE, TRUE, NOW(), NOW()),

(8, 'Radiographie capteur numérique RVG', 'capteur-numerique-rvg', 6, 6,
 7200.000, 8100.000,
 'Capteur radiographique numérique intra-oral haute résolution, connexion USB plug-and-play. Imagerie nette pour diagnostics précis.',
 6, 20, FALSE, TRUE, FALSE, TRUE, NOW(), NOW()),

-- ---- Produits supplémentaires pour test ---------------------------------
(9, 'Turbine haute vitesse à fibre optique', 'turbine-fibre-optique', 1, 4,
 980.000, 1150.000,
 'Turbine dentaire haute vitesse avec éclairage à fibre optique LED. Roulements céramiques pour une longévité accrue et un niveau sonore réduit.',
 15, 30, FALSE, TRUE, TRUE, TRUE, NOW(), NOW()),

(10, 'Contre-angle bague rouge 1:5', 'contre-angle-bague-rouge', 1, 4,
 1450.000, NULL,
 'Contre-angle multiplicateur 1:5 bague rouge avec spray quadruple. Idéal pour la préparation prothétique de haute précision.',
 8, 25, TRUE, FALSE, FALSE, TRUE, NOW(), NOW()),

(11, 'Détartreur ultrasonique piézoélectrique', 'detartreur-ultrasonique', 2, 1,
 1850.000, 2100.000,
 'Détartreur ultrasonique avec 5 inserts compatibles EMS. Puissance réglable, irrigation par bouteille externe.',
 7, 20, FALSE, TRUE, FALSE, TRUE, NOW(), NOW()),

(12, 'Anesthésique lidocaïne 2% (boîte 50)', 'anesthesique-lidocaine-2', 2, 7,
 95.000, NULL,
 'Cartouches d''anesthésie locale à base de lidocaïne 2% avec adrénaline 1/100 000. Boîte de 50 cartouches stériles.',
 60, 100, FALSE, FALSE, TRUE, TRUE, NOW(), NOW()),

(13, 'Aiguilles dentaires 30G courtes (boîte 100)', 'aiguilles-30g-courtes', 5, 7,
 35.000, NULL,
 'Aiguilles dentaires stériles 30G courtes, biseau triple pour une pénétration en douceur. Compatibles seringues standard.',
 90, 120, FALSE, FALSE, FALSE, TRUE, NOW(), NOW()),

(14, 'Plâtre dentaire type IV (5kg)', 'platre-dentaire-type-iv', 4, 3,
 78.000, NULL,
 'Plâtre extra-dur type IV pour modèles de travail et maîtres-modèles. Faible expansion et haute résistance à la compression.',
 25, 60, TRUE, FALSE, FALSE, TRUE, NOW(), NOW()),

(15, 'Alginate à prise rapide (sachet 500g)', 'alginate-prise-rapide', 4, 3,
 22.000, 28.000,
 'Alginate à prise rapide aromatisé menthe pour empreintes de précision. Stabilité dimensionnelle et excellente reproduction des détails.',
 110, 150, FALSE, TRUE, TRUE, TRUE, NOW(), NOW()),

(16, 'Masques chirurgicaux 3 plis (boîte 50)', 'masques-chirurgicaux-3plis', 5, 2,
 12.500, NULL,
 'Masques chirurgicaux type IIR à 3 plis avec barrette nasale. Filtration bactérienne > 98%, élastiques confortables.',
 200, 300, FALSE, FALSE, FALSE, TRUE, NOW(), NOW()),

(17, 'Solution désinfectante surfaces 5L', 'solution-desinfectante-5l', 5, 5,
 65.000, NULL,
 'Désinfectant prêt à l''emploi pour surfaces et dispositifs non invasifs. Bactéricide, virucide et fongicide en 60 secondes.',
 40, 80, FALSE, FALSE, FALSE, TRUE, NOW(), NOW()),

(18, 'Caméra intra-orale HD USB', 'camera-intra-orale-hd', 6, 6,
 1950.000, 2300.000,
 'Caméra intra-orale haute définition avec 6 LED réglables. Connexion USB plug-and-play, idéale pour la communication patient.',
 5, 15, TRUE, TRUE, FALSE, TRUE, NOW(), NOW()),

(19, 'Tabouret ergonomique praticien', 'tabouret-ergonomique-praticien', 3, 8,
 480.000, NULL,
 'Tabouret ergonomique réglable en hauteur avec dossier lombaire. Revêtement vinyle médical facile à désinfecter.',
 10, 20, FALSE, FALSE, FALSE, TRUE, NOW(), NOW()),

(20, 'Eugénol oxyde de zinc (coffret)', 'eugenol-oxyde-zinc', 3, 3,
 38.000, NULL,
 'Ciment provisoire à base d''eugénol et oxyde de zinc pour scellement et obturation temporaire. Coffret poudre + liquide.',
 35, 50, FALSE, FALSE, FALSE, TRUE, NOW(), NOW());

SELECT setval('products_product_id_seq', (SELECT MAX(id) FROM products_product));

-- =====================================================================
-- 4. IMAGES PRODUITS
-- =====================================================================
INSERT INTO products_productimage (product_id, image, alt_text, is_primary, "order") VALUES
(1,  'products/micromoteur.png', 'Micromoteur électrique sans fil',         TRUE, 0),
(2,  'products/composite.png',   'Composite photopolymérisable A2',         TRUE, 0),
(3,  'products/autoclave.png',   'Autoclave 18L classe B',                  TRUE, 0),
(4,  'products/fraises.png',     'Kit fraises diamantées',                  TRUE, 0),
(5,  'products/resine.png',      'Résine acrylique pour prothèse',          TRUE, 0),
(6,  'products/lampe.png',       'Lampe à photopolymériser LED',            TRUE, 0),
(7,  'products/gants.png',       'Gants nitrile non poudrés',               TRUE, 0),
(8,  'products/capteur.png',     'Capteur numérique RVG',                   TRUE, 0),
(9,  'products/turbine.png',     'Turbine haute vitesse à fibre optique',   TRUE, 0),
(10, 'products/contre-angle.png','Contre-angle bague rouge',                TRUE, 0),
(11, 'products/detartreur.png',  'Détartreur ultrasonique',                 TRUE, 0),
(12, 'products/lidocaine.png',   'Anesthésique lidocaïne 2%',               TRUE, 0),
(13, 'products/aiguilles.png',   'Aiguilles dentaires 30G',                 TRUE, 0),
(14, 'products/platre.png',      'Plâtre dentaire type IV',                 TRUE, 0),
(15, 'products/alginate.png',    'Alginate à prise rapide',                 TRUE, 0),
(16, 'products/masques.png',     'Masques chirurgicaux 3 plis',             TRUE, 0),
(17, 'products/desinfectant.png','Solution désinfectante surfaces',         TRUE, 0),
(18, 'products/camera.png',      'Caméra intra-orale HD',                   TRUE, 0),
(19, 'products/tabouret.png',    'Tabouret ergonomique',                    TRUE, 0),
(20, 'products/eugenol.png',     'Eugénol oxyde de zinc',                   TRUE, 0);

-- =====================================================================
-- 5. DÉTAILS PRODUITS (clé / valeur)
-- =====================================================================
INSERT INTO products_productdetail (product_id, label, value) VALUES
-- p1
(1, 'Vitesse',       '200 - 40 000 tr/min'),
(1, 'Couple',        'Jusqu''à 4 Ncm'),
(1, 'Autonomie',     'Environ 4 heures'),
(1, 'Garantie',      '2 ans'),
-- p2
(2, 'Teinte',        'A2 universelle'),
(2, 'Contenu',       'Kit 4 seringues'),
(2, 'Polymérisation','LED 20s'),
(2, 'Conservation',  '24 mois'),
-- p3
(3, 'Capacité',      '18 litres'),
(3, 'Classe',        'B (norme EN 13060)'),
(3, 'Cycles',        '6 programmes'),
(3, 'Garantie',      '3 ans'),
-- p4
(4, 'Quantité',      '10 fraises'),
(4, 'Grain',         'Fin à gros'),
(4, 'Tige',          'FG 314'),
(4, 'Stérilisable',  'Oui'),
-- p5
(5, 'Poids',         '500 g (poudre)'),
(5, 'Type',          'Thermopolymérisable'),
(5, 'Teinte',        'Rose veiné'),
(5, 'Usage',         'Prothèse complète & partielle'),
-- p6
(6, 'Puissance',     '1200 mW/cm²'),
(6, 'Modes',         '3 (standard, rampe, pulse)'),
(6, 'Spectre',       '385 - 515 nm'),
(6, 'Autonomie',     'Environ 300 cycles'),
-- p7
(7, 'Matière',       'Nitrile sans latex'),
(7, 'Quantité',      '100 gants / boîte'),
(7, 'Tailles',       'S, M, L, XL'),
(7, 'Norme',         'EN 455'),
-- p8
(8, 'Résolution',    '> 20 lp/mm'),
(8, 'Taille',        'Capteur n°2'),
(8, 'Connexion',     'USB 2.0'),
(8, 'Garantie',      '2 ans'),
-- p9
(9, 'Vitesse',       '400 000 tr/min'),
(9, 'Spray',         '4 jets'),
(9, 'Éclairage',     'LED fibre optique'),
(9, 'Roulements',    'Céramiques'),
-- p10
(10, 'Rapport',      '1:5 multiplicateur'),
(10, 'Spray',        'Quadruple'),
(10, 'Type',         'Bague rouge'),
(10, 'Garantie',     '1 an'),
-- p11
(11, 'Inserts',      '5 inclus (compatibles EMS)'),
(11, 'Fréquence',    '28 kHz'),
(11, 'Irrigation',   'Bouteille externe 500 ml'),
(11, 'Puissance',    'Réglable 5 niveaux'),
-- p12
(12, 'Principe actif','Lidocaïne 2% + adrénaline 1/100 000'),
(12, 'Conditionnement','Boîte de 50 cartouches'),
(12, 'Volume',       '1.8 ml par cartouche'),
(12, 'Stérilité',    'Stérile'),
-- p13
(13, 'Calibre',      '30G court'),
(13, 'Longueur',     '21 mm'),
(13, 'Biseau',       'Triple'),
(13, 'Quantité',     '100 unités'),
-- p14
(14, 'Type',         'Plâtre IV extra-dur'),
(14, 'Poids',        '5 kg'),
(14, 'Expansion',    '< 0.08%'),
(14, 'Résistance',   '> 50 MPa'),
-- p15
(15, 'Prise',        'Rapide (1 min 30)'),
(15, 'Arôme',        'Menthe'),
(15, 'Poids',        '500 g'),
(15, 'Sans poussière','Oui'),
-- p16
(16, 'Type',         'Chirurgical IIR 3 plis'),
(16, 'Filtration',   'BFE > 98%'),
(16, 'Quantité',     '50 / boîte'),
(16, 'Norme',        'EN 14683'),
-- p17
(17, 'Volume',       '5 litres'),
(17, 'Action',       'Bactéricide, virucide, fongicide'),
(17, 'Temps action', '60 secondes'),
(17, 'Usage',        'Surfaces et dispositifs'),
-- p18
(18, 'Résolution',   'HD 1280 x 720'),
(18, 'Éclairage',    '6 LED réglables'),
(18, 'Connexion',    'USB 2.0 plug-and-play'),
(18, 'Garantie',     '1 an'),
-- p19
(19, 'Réglage',      'Vérin pneumatique'),
(19, 'Hauteur',      '45 - 60 cm'),
(19, 'Revêtement',   'Vinyle médical'),
(19, 'Couleur',      'Bleu nuit'),
-- p20
(20, 'Composition',  'Oxyde de zinc + eugénol'),
(20, 'Usage',        'Scellement provisoire'),
(20, 'Présentation', 'Poudre + liquide'),
(20, 'Conservation', '36 mois');

-- =====================================================================
-- 6. CODES PROMO
-- =====================================================================
INSERT INTO promotions_promocode
(id, code, description, discount_percentage, category_id, min_order_amount,
 max_uses, times_used, is_active, expires_at, created_at) VALUES
(1, 'DCS10',      '10% sur toute la commande',          10.00, NULL, 0.000,    0, 0, TRUE, '2026-08-31 23:59:59+01', NOW()),
(2, 'PROTHESE15', '15% sur la catégorie Prothèse',      15.00, 3,    0.000,    0, 0, TRUE, '2026-07-15 23:59:59+01', NOW()),
(3, 'ETUDIANT20', '20% tarif étudiant',                 20.00, NULL, 0.000,  500, 12, TRUE, '2026-09-30 23:59:59+01', NOW()),
(4, 'BIENVENUE5', '5% offerts pour la 1ère commande',    5.00, NULL, 100.000, 0, 0, TRUE, '2026-12-31 23:59:59+01', NOW()),
(5, 'HYGIENE10',  '10% sur l''hygiène & stérilisation', 10.00, 5,    200.000, 200, 7, TRUE, '2026-10-31 23:59:59+01', NOW());

SELECT setval('promotions_promocode_id_seq', (SELECT MAX(id) FROM promotions_promocode));

COMMIT;

-- =====================================================================
-- Vérifications rapides (optionnel - commenter si non souhaité)
-- =====================================================================
SELECT 'Catégories' AS table_name, COUNT(*) AS total FROM products_category
UNION ALL SELECT 'Marques',        COUNT(*) FROM products_brand
UNION ALL SELECT 'Produits',       COUNT(*) FROM products_product
UNION ALL SELECT 'Images',         COUNT(*) FROM products_productimage
UNION ALL SELECT 'Détails',        COUNT(*) FROM products_productdetail
UNION ALL SELECT 'Codes promo',    COUNT(*) FROM promotions_promocode;
