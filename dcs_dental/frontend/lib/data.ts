export type Role =
  | "Dentiste"
  | "Prothésiste dentaire"
  | "Étudiant en prothèse dentaire"
  | "Étudiant en médecine dentaire"

export type StockLevel = "low" | "medium" | "high"

export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviewCount: number
  stock: number
  stockMax: number
  image: string
  images: string[]
  description: string
  details: { label: string; value: string }[]
  isNew?: boolean
  isPromo?: boolean
  isBestSeller?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  count: number
}

export interface Brand {
  id: string
  name: string
}

export const categories: Category[] = [
  { id: "c1", name: "Instruments", slug: "instruments", count: 42 },
  { id: "c2", name: "Consommables", slug: "consommables", count: 88 },
  { id: "c3", name: "Prothèse", slug: "prothese", count: 36 },
  { id: "c4", name: "Rotatifs", slug: "rotatifs", count: 24 },
  { id: "c5", name: "Hygiène & Stérilisation", slug: "hygiene", count: 31 },
  { id: "c6", name: "Imagerie", slug: "imagerie", count: 12 },
  { id: "c7", name: "Anesthésie", slug: "anesthesie", count: 18 },
  { id: "c8", name: "Mobilier", slug: "mobilier", count: 9 },
]

export const brands: Brand[] = [
  { id: "b1", name: "DentaPro" },
  { id: "b2", name: "MediTech" },
  { id: "b3", name: "OrisLine" },
  { id: "b4", name: "ProsthoLab" },
  { id: "b5", name: "CleanDent" },
  { id: "b6", name: "RadioMax" },
]

function stockLevel(stock: number, max: number): StockLevel {
  const ratio = stock / max
  if (ratio <= 0.25) return "low"
  if (ratio <= 0.6) return "medium"
  return "high"
}

export function getStockLevel(p: Product): StockLevel {
  return stockLevel(p.stock, p.stockMax)
}

export const stockMeta: Record<
  StockLevel,
  { label: string; colorClass: string; barClass: string }
> = {
  low: {
    label: "Stock faible",
    colorClass: "text-destructive",
    barClass: "bg-destructive",
  },
  medium: {
    label: "Stock moyen",
    colorClass: "text-warning",
    barClass: "bg-warning",
  },
  high: {
    label: "Stock disponible",
    colorClass: "text-success",
    barClass: "bg-success",
  },
}

const img = "/products"

export const products: Product[] = [
  {
    id: "p1",
    name: "Micromoteur électrique sans fil",
    slug: "micromoteur-electrique-sans-fil",
    brand: "DentaPro",
    category: "rotatifs",
    price: 1290,
    oldPrice: 1590,
    rating: 4.8,
    reviewCount: 126,
    stock: 4,
    stockMax: 40,
    image: `${img}/micromoteur.png`,
    images: [`${img}/micromoteur.png`],
    description:
      "Micromoteur électrique sans fil haute précision avec contrôle de couple numérique, idéal pour les procédures d'endodontie et de prothèse. Batterie longue durée et ergonomie optimisée.",
    details: [
      { label: "Vitesse", value: "200 - 40 000 tr/min" },
      { label: "Couple", value: "Jusqu'à 4 Ncm" },
      { label: "Autonomie", value: "Environ 4 heures" },
      { label: "Garantie", value: "2 ans" },
    ],
    isPromo: true,
    isBestSeller: true,
  },
  {
    id: "p2",
    name: "Composite photopolymérisable A2 (kit)",
    slug: "composite-photopolymerisable-a2",
    brand: "MediTech",
    category: "consommables",
    price: 320,
    rating: 4.6,
    reviewCount: 84,
    stock: 22,
    stockMax: 50,
    image: `${img}/composite.png`,
    images: [`${img}/composite.png`],
    description:
      "Composite nano-hybride photopolymérisable teinte A2, esthétique et résistant. Excellente manipulation et polissage durable pour restaurations antérieures et postérieures.",
    details: [
      { label: "Teinte", value: "A2 universelle" },
      { label: "Contenu", value: "Kit 4 seringues" },
      { label: "Polymérisation", value: "LED 20s" },
      { label: "Conservation", value: "24 mois" },
    ],
    isBestSeller: true,
  },
  {
    id: "p3",
    name: "Autoclave de stérilisation 18L classe B",
    slug: "autoclave-sterilisation-18l",
    brand: "CleanDent",
    category: "hygiene",
    price: 4850,
    oldPrice: 5400,
    rating: 4.9,
    reviewCount: 53,
    stock: 28,
    stockMax: 35,
    image: `${img}/autoclave.png`,
    images: [`${img}/autoclave.png`],
    description:
      "Autoclave classe B 18 litres avec cycles programmables et impression de traçabilité. Conforme aux normes européennes de stérilisation des dispositifs médicaux.",
    details: [
      { label: "Capacité", value: "18 litres" },
      { label: "Classe", value: "B (norme EN 13060)" },
      { label: "Cycles", value: "6 programmes" },
      { label: "Garantie", value: "3 ans" },
    ],
    isPromo: true,
  },
  {
    id: "p4",
    name: "Kit fraises diamantées (10 pièces)",
    slug: "kit-fraises-diamantees",
    brand: "OrisLine",
    category: "rotatifs",
    price: 145,
    rating: 4.5,
    reviewCount: 210,
    stock: 12,
    stockMax: 60,
    image: `${img}/fraises.png`,
    images: [`${img}/fraises.png`],
    description:
      "Assortiment de 10 fraises diamantées de granulométrie variée pour la préparation et la finition. Tige conforme aux turbines standard.",
    details: [
      { label: "Quantité", value: "10 fraises" },
      { label: "Grain", value: "Fin à gros" },
      { label: "Tige", value: "FG 314" },
      { label: "Stérilisable", value: "Oui" },
    ],
    isNew: true,
  },
  {
    id: "p5",
    name: "Résine acrylique pour prothèse (500g)",
    slug: "resine-acrylique-prothese",
    brand: "ProsthoLab",
    category: "prothese",
    price: 410,
    oldPrice: 480,
    rating: 4.7,
    reviewCount: 67,
    stock: 9,
    stockMax: 45,
    image: `${img}/resine.png`,
    images: [`${img}/resine.png`],
    description:
      "Résine acrylique thermopolymérisable haute résistance pour la fabrication de prothèses dentaires. Teinte stable et finition esthétique de qualité laboratoire.",
    details: [
      { label: "Poids", value: "500 g (poudre)" },
      { label: "Type", value: "Thermopolymérisable" },
      { label: "Teinte", value: "Rose veiné" },
      { label: "Usage", value: "Prothèse complète & partielle" },
    ],
    isPromo: true,
  },
  {
    id: "p6",
    name: "Lampe à photopolymériser LED",
    slug: "lampe-photopolymeriser-led",
    brand: "MediTech",
    category: "instruments",
    price: 690,
    rating: 4.8,
    reviewCount: 91,
    stock: 31,
    stockMax: 40,
    image: `${img}/lampe.png`,
    images: [`${img}/lampe.png`],
    description:
      "Lampe LED de photopolymérisation sans fil avec large spectre d'émission et plusieurs modes. Léger, puissant et doté d'un radiomètre intégré.",
    details: [
      { label: "Puissance", value: "1200 mW/cm²" },
      { label: "Modes", value: "3 (standard, rampe, pulse)" },
      { label: "Spectre", value: "385 - 515 nm" },
      { label: "Autonomie", value: "Environ 300 cycles" },
    ],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "p7",
    name: "Gants nitrile non poudrés (boîte 100)",
    slug: "gants-nitrile-non-poudres",
    brand: "CleanDent",
    category: "consommables",
    price: 48,
    rating: 4.4,
    reviewCount: 340,
    stock: 48,
    stockMax: 80,
    image: `${img}/gants.png`,
    images: [`${img}/gants.png`],
    description:
      "Gants d'examen en nitrile non poudrés, confortables et résistants. Sans latex, idéaux pour les praticiens et patients sensibles.",
    details: [
      { label: "Matière", value: "Nitrile sans latex" },
      { label: "Quantité", value: "100 gants / boîte" },
      { label: "Tailles", value: "S, M, L, XL" },
      { label: "Norme", value: "EN 455" },
    ],
  },
  {
    id: "p8",
    name: "Radiographie capteur numérique RVG",
    slug: "capteur-numerique-rvg",
    brand: "RadioMax",
    category: "imagerie",
    price: 7200,
    oldPrice: 8100,
    rating: 4.9,
    reviewCount: 38,
    stock: 6,
    stockMax: 20,
    image: `${img}/capteur.png`,
    images: [`${img}/capteur.png`],
    description:
      "Capteur radiographique numérique intra-oral haute résolution, connexion USB plug-and-play. Imagerie nette pour diagnostics précis.",
    details: [
      { label: "Résolution", value: "> 20 lp/mm" },
      { label: "Taille", value: "Capteur n°2" },
      { label: "Connexion", value: "USB 2.0" },
      { label: "Garantie", value: "2 ans" },
    ],
    isPromo: true,
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function relatedProducts(p: Product, n = 4) {
  return products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, n)
}

export interface Testimonial {
  id: string
  name: string
  role: Role
  rating: number
  text: string
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Dr. Amine Khelifi",
    role: "Dentiste",
    rating: 5,
    text: "Livraison rapide et matériel conforme. Le paiement à la livraison est un vrai plus pour mon cabinet.",
  },
  {
    id: "t2",
    name: "Sonia Belhadj",
    role: "Prothésiste dentaire",
    rating: 5,
    text: "Catalogue très complet pour le laboratoire. Les résines et consommables sont d'excellente qualité.",
  },
  {
    id: "t3",
    name: "Yassine Mabrouk",
    role: "Étudiant en médecine dentaire",
    rating: 4,
    text: "Des prix étudiants intéressants et un service après-vente réactif. Je recommande vivement.",
  },
]

export const faqs = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "Nous livrons partout dans le pays sous 24 à 72 heures. La livraison est gratuite pour toute commande de matériel professionnel.",
  },
  {
    q: "Le paiement à la livraison est-il disponible ?",
    a: "Oui, vous pouvez régler votre commande en espèces directement à la réception du colis, sans frais supplémentaires.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Vous disposez de 15 jours pour retourner un produit non utilisé dans son emballage d'origine. Le remboursement est traité sous 7 jours.",
  },
  {
    q: "Proposez-vous des tarifs pour les étudiants ?",
    a: "Oui, les étudiants en médecine et prothèse dentaire bénéficient de tarifs préférentiels sur une sélection de produits.",
  },
  {
    q: "Les produits sont-ils certifiés ?",
    a: "Tous nos produits sont certifiés et conformes aux normes médicales en vigueur (CE, EN, ISO selon les catégories).",
  },
]

export interface Coupon {
  code: string
  description: string
  discountPct: number
  expires: string
}

export const coupons: Coupon[] = [
  { code: "DCS10", description: "10% sur toute la commande", discountPct: 10, expires: "2026-08-31" },
  { code: "PROTHESE15", description: "15% sur la catégorie Prothèse", discountPct: 15, expires: "2026-07-15" },
  { code: "ETUDIANT20", description: "20% tarif étudiant", discountPct: 20, expires: "2026-09-30" },
]

export const roles: Role[] = [
  "Dentiste",
  "Prothésiste dentaire",
  "Étudiant en prothèse dentaire",
  "Étudiant en médecine dentaire",
]
