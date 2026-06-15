import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import { Product, Order, BlogArticle, DashboardStats, Review } from "./src/types";

// Lazy-loaded GoogleGenAI instance for high-end video dynamic modeling (Veo 3)
let geaiClient: GoogleGenAI | null = null;
function getGeai() {
  if (!geaiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La clé d'API GEMINI_API_KEY n'est pas configurée dans les paramètres de l'application.");
    }
    geaiClient = new GoogleGenAI({ apiKey: key });
  }
  return geaiClient;
}

// Database storage setup
const DATA_FILE = path.join(process.cwd(), "db_alpha_store.json");

// Define professional initial data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "iphone-13",
    name: "iPhone 13",
    series: "iPhone 13",
    description: "L'iPhone 13 de 6,1 pouces incarne la polyvalence ultime avec sa puce A15 Bionic ultra-rapide, son double appareil photo de pointe avec mode Cinématique, et son autonomie de batterie grandement améliorée pour vous accompagner à Pointe-Noire toute la journée.",
    priceFCFA: 550000,
    priceUSD: 840,
    stock: 8,
    colors: ["Minuit", "Lumière Stellaire", "Bleu", "Rose"],
    storage: ["128 Go", "256 Go"],
    images: ["#1e293b", "#3b82f6", "#f43f5e"], // Hex values representing premium color backdrops
    screen: "6.1 pouces Super Retina XDR OLED",
    processor: "A15 Bionic (GPU 4 cœurs)",
    ram: "4 Go",
    battery: "3227 mAh - Charge 20W",
    camera: "Double capteur 12 Mpx (Grand-angle et Ultra grand-angle) - Zoom optique 2x",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.4,
    reviewsCountOverride: 15,
    badgeOverride: "RAPPORT QUALITÉ-PRIX"
  },
  {
    id: "iphone-13-pro",
    name: "iPhone 13 Pro",
    series: "iPhone 13 Pro",
    description: "Écran Super Retina XDR de 6,1 pouces avec ProMotion de 120 Hz pour une fluidité sans précédent. Profitez de l'incroyable triple objectif photo Pro et du châssis robuste en acier pour la capture professionnelle.",
    priceFCFA: 650000,
    priceUSD: 1000,
    stock: 5,
    colors: ["Bleu Alpin", "Graphite", "Or", "Argent"],
    storage: ["128 Go", "256 Go", "512 Go"],
    images: ["#475569", "#1e3a8a", "#b45309"],
    screen: "6.1 pouces Super Retina XDR OLED - ProMotion 120Hz",
    processor: "A15 Bionic (GPU 5 cœurs)",
    ram: "6 Go",
    battery: "3095 mAh - ProMotion intelligent",
    camera: "Triple capteur 12 Mpx avec Scanner LiDAR - Zoom optique 3x",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.5,
    reviewsCountOverride: 12,
    badgeOverride: "CLASSIQUE PRO"
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    series: "iPhone 14",
    description: "Un écran de grande classe de 6,1 pouces avec détection des accidents et SOS d'urgence par satellite. Son système photo capture des images remarquables dans toutes les conditions de luminosité.",
    priceFCFA: 580000,
    priceUSD: 900,
    stock: 2, // low stock for alert
    colors: ["Noir", "Mauve", "Bleu", "Lumière Stellaire"],
    storage: ["128 Go", "256 Go"],
    images: ["#111827", "#818cf8", "#38bdf8"],
    screen: "6.1 pouces Super Retina XDR",
    processor: "A15 Bionic (GPU 5 cœurs)",
    ram: "6 Go",
    battery: "3279 mAh - Charge rapide",
    camera: "Double capteur 12 Mpx avec Photonic Engine - Zoom optique 2x",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.5,
    reviewsCountOverride: 14,
    badgeOverride: "VALEUR SÛRE"
  },
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    series: "iPhone 14 Pro",
    description: "La révolution de la Dynamic Island et l'affichage Toujours activé avec un appareil photo principal ultra-haute résolution de 48 Mpx pour immortaliser vos précieux moments à Pointe-Noire.",
    priceFCFA: 780000,
    priceUSD: 1200,
    stock: 6,
    colors: ["Violet Intense", "Noir Sidéral", "Or", "Argent"],
    storage: ["128 Go", "256 Go", "512 Go"],
    images: ["#4c1d95", "#030712", "#ca8a04"],
    screen: "6.1 pouces Super Retina XDR - Always-On & Dynamic Island",
    processor: "A16 Bionic (4nm)",
    ram: "6 Go",
    battery: "3200 mAh - Always-on display",
    camera: "Objectif principal 48 Mpx + Ultra grand-angle + Téléobjectif 3x",
    isFeatured: true,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.5,
    reviewsCountOverride: 18,
    badgeOverride: "EXCELLENT CHOIX"
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    series: "iPhone 15",
    description: "Intègre fièrement la Dynamic Island, un appareil photo exceptionnel de 48 Mpx pour des photos aux détails époustouflants, et la connectivité universelle USB-C entourée d'un boîtier en aluminium résistant.",
    priceFCFA: 650000,
    priceUSD: 1000,
    stock: 9,
    colors: ["Noir", "Bleu Pastel", "Vert Pastel", "Jaune Pastel", "Rose"],
    storage: ["128 Go", "256 Go", "512 Go"],
    images: ["#0f172a", "#bae6fd", "#bbf7d0"],
    screen: "6.1 pouces Super Retina XDR avec Dynamic Island",
    processor: "A16 Bionic",
    ram: "6 Go",
    battery: "3349 mAh - Connecteur USB-C 2.0",
    camera: "Objectif principal 48 Mpx + Ultra grand-angle 12 Mpx - Zoom optique 2x",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.5,
    reviewsCountOverride: 16,
    badgeOverride: "DESIGN RAFFINÉ"
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    series: "iPhone 15 Pro",
    description: "Conçu avec du titane de qualité aérospatiale, intégrant le bouton Action personnalisable, la puce révolutionnaire A17 Pro pour les graphismes de jeu vidéo ultra-immersifs, et un zoom optique ultime.",
    priceFCFA: 950000,
    priceUSD: 1460,
    stock: 12,
    colors: ["Titane Noir", "Titane Blanc", "Titane Naturel", "Titane Bleu"],
    storage: ["128 Go", "256 Go", "512 Go", "1 To"],
    images: ["#1c1917", "#f5f5f4", "#a8a29e", "#1e3a8a"],
    screen: "6.1 pouces OLED Super Retina XDR ProMotion",
    processor: "A17 Pro (3nm)",
    ram: "8 Go",
    battery: "3274 mAh - Port USB-C 3.0 ultra-rapide",
    camera: "Objectif principal 48 Mpx + Ultra grand-angle + Téléobjectif 3x",
    isFeatured: true,
    isNew: false,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.6,
    reviewsCountOverride: 21,
    badgeOverride: "POPULAIRE"
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    series: "iPhone 16",
    description: "Découvrez le tout nouveau bouton Commande de l'appareil photo, la puce A18 sur-mesure optimisée pour l'IA, et des performances thermiques de pointe pour une expérience technologique de haut vol à Pointe-Noire.",
    priceFCFA: 780000,
    priceUSD: 1200,
    stock: 15,
    colors: ["Noir", "Blanc", "Bleu Outremer", "Sarcelle", "Rose"],
    storage: ["128 Go", "256 Go", "512 Go"],
    images: ["#020617", "#f8fafc", "#1d4ed8", "#115e59"],
    screen: "6.1 pouces Super Retina XDR avec Commande Photo",
    processor: "A18 chip optimized for Apple Intelligence",
    ram: "8 Go (Requis pour l'IA)",
    battery: "3561 mAh - Amélioration thermique",
    camera: "Système photo Fusion 48 Mpx et Ultra grand-angle 12 Mpx - Macro de pointe",
    isFeatured: false,
    isNew: true,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.6,
    reviewsCountOverride: 22,
    badgeOverride: "COMMANDE PHOTO"
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    series: "iPhone 16 Pro",
    description: "Le summum de l'innovation avec des bordures d'écran plus fines au monde, un écran de 6,3 pouces plus grand, le bouton de Commande de l'appareil photo instantané, et la puce de pointe A18 Pro pour l'intelligence.",
    priceFCFA: 1150000,
    priceUSD: 1770,
    stock: 10,
    colors: ["Titane Sable", "Titane Naturel", "Titane Blanc", "Titane Noir"],
    storage: ["128 Go", "256 Go", "512 Go", "1 To"],
    images: ["#c5a880", "#a8a29e", "#e2e8f0", "#0f172a"],
    screen: "6.3 pouces OLED Super Retina XDR - Bordures micro",
    processor: "A18 Pro (Gravure de pointe, GPU 6 cœurs)",
    ram: "8 Go (Intégration d'IA avancée)",
    battery: "3582 mAh - Superbe gestion énergétique",
    camera: "Caméra Fusion 48 Mpx + Ultra grand-angle 48 Mpx + Téléobjectif 5x 12 Mpx",
    isFeatured: true,
    isNew: true,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.7,
    reviewsCountOverride: 28,
    badgeOverride: "NOUVEAU"
  },
  {
    id: "iphone-17",
    name: "iPhone 17 (Précommande)",
    series: "iPhone 17",
    description: "Le futur s'écrit maintenant. L'iPhone 17 apporte un design affiné ultra-mince révolutionnaire, un taux de rafraîchissement ProMotion 120Hz sur toute la gamme pour un défilement sublime, et un écran anti-reflet en cristal de saphir.",
    priceFCFA: 900000,
    priceUSD: 1400,
    stock: 3,
    colors: ["Bleu Cobalt", "Gris Lunaire", "Blanc Saphir", "Noir Absolu"],
    storage: ["128 Go", "256 Go", "512 Go"],
    images: ["#1e40af", "#64748b", "#f1f5f9", "#000000"],
    screen: "6.2 pouces ProMotion 120Hz anti-reflet renforcé",
    processor: "A19 Bionic (Fabrication nouvelle génération)",
    ram: "12 Go (IA de niveau supérieur)",
    battery: "3700 mAh - Recharge rapide 35W sans fil",
    camera: "Double capteur 48 Mpx intelligent avec zoom IA",
    isFeatured: false,
    isNew: true,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.7,
    reviewsCountOverride: 5,
    badgeOverride: "PRÉCOMMANDE"
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro (Précommande)",
    series: "iPhone 17 Pro",
    description: "L'iPhone ultime du futur en avant-première chez Alpha+. Introduisant un châssis monocoque en alliage titane-aluminium poli, un triple capteur Fusion de 48 Mpx simultanés pour l'imagerie holographique, et la puce d'exception de génération A19 Pro.",
    priceFCFA: 1250000,
    priceUSD: 1920,
    stock: 4,
    colors: ["Or Royal", "Titane Cosmique", "Vert Émeraude", "Carbone Brillant"],
    storage: ["256 Go", "512 Go", "1 To"],
    images: ["#ca8a04", "#475569", "#064e3b", "#111827"],
    screen: "6.7 pouces Super Retina XDR OLED - 1600 nits constant",
    processor: "A19 Pro (Graveur de nouvelle génération, IA multimodale)",
    ram: "12 Go RAM unifiée",
    battery: "4200 mAh - Optimisée charge intelligente ultra-faste",
    camera: "Triple fusion Pro 48 Mpx intégrale + Capteur périscopique spatial 10x",
    isFeatured: true,
    isNew: true,
    isPromo: false,
    reviews: [],
    ratingOverride: 4.8,
    reviewsCountOverride: 32,
    badgeOverride: "NOUVEAU - PRÉCOMMANDE"
  }
];

const INITIAL_BLOG: BlogArticle[] = [
  {
    id: "news-1",
    title: "Guide de précommande de l'iPhone 17 chez Alpha+ Congo",
    excerpt: "Comment se préparer à l'arrivée de la nouvelle génération d'iPhones à Pointe-Noire et Brazzaville. Choix de stockage et coloris disponibles.",
    content: "L'excitation monte dans le monde technologique alors que les premières rumeurs officielles concernant l'iPhone 17 et l'iPhone 17 Pro commencent à se matérialiser. Chez Alpha+, nous nous engageons à offrir à notre clientèle distinguée de Pointe-Noire les nouveautés d'Apple dès leur sortie internationale.\n\n### Les innovations attendues :\n- **Taux de rafraîchissement ProMotion 120Hz pour tous** : Apple prévoit d'étendre la technologie ProMotion aux modèles de base, éliminant ainsi les saccades visuelles.\n- **Un écran anti-reflet renforcé** : Idéal pour vos promenades ensoleillées sur la Côte Sauvage de Pointe-Noire, le nouveau traitement d'écran promet une lisibilité accrue sous la lumière vive.\n- **Allègement du poids** : Grâce à un nouvel alliage de métaux légers de pointe.\n\n### Comment précommander ?\nIl vous suffit de nous contacter directement via notre messagerie WhatsApp ou par notre formulaire de contact en ligne. Un conseiller d'Alpha+ prendra contact avec vous pour sécuriser votre unité préférée.",
    category: "Guides d'achat",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    date: "2026-06-10",
    author: "Alpha+ Expert",
    readTime: "4 min"
  },
  {
    id: "news-2",
    title: "Pourquoi le Titane de l'iPhone 15 Pro & 16 Pro change tout ?",
    excerpt: "Découvrez pourquoi le passage au titane a permis d'optimiser le poids tout en augmentant la durabilité et la résistance thermique des modèles Pro.",
    content: "Depuis l'iPhone 15 Pro, Apple a introduit une transition radicale : l'alliage de titane de qualité aérospatiale. Mais quel est l'impact réel pour un utilisateur congolais au quotidien ?\n\n1. **Une légèreté extraordinaire** : Le gain de poids est de près de 10% par rapport à l'acier inoxydable classique de l'iPhone 14 Pro, soulageant vos mains lors de longs appels.\n2. **Résistance exceptionnelle aux rayures** : La finition brossée ne montre pas les traces de doigts et résiste mieux aux petits accidents quotidiens.\n3. **Gestion améliorée de la température** : Votre iPhone chauffe de manière beaucoup plus homogène.\n\nChez Alpha+, nous disposons de toute la gamme de coloris Titane (Naturel, Noir, Blanc, Sable) directement disponibles pour essai sur rendez-vous.",
    category: "Comparatifs",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    date: "2026-06-03",
    author: "Service Technique",
    readTime: "5 min"
  },
  {
    id: "news-3",
    title: "5 astuces méconnues pour optimiser la batterie de votre iPhone",
    excerpt: "Conseils techniques simples pour prolonger la durée de vie globale de votre batterie d'iPhone sous notre climat tropical de Pointe-Noire.",
    content: "Notre climat chaud et humide à Pointe-Noire présente des défis spécifiques pour la chimie des batteries lithium-ion. Apprenez à la préserver durablement :\n\n- **Activer la charge optimisée** : Allez dans Réglages > Batterie > État de santé et charge, et activez 'Recharge optimisée de la batterie'.\n- **Éviter l'exposition directe du soleil** : Ne laissez jamais votre iPhone sur le tableau de bord d'un véhicule garé à Pointe-Noire.\n- **Préférer des chargeurs originaux** : Les chargeurs contrefaits régulent mal le courant thermique et endommagent les puces d'alimentation.\n- **Limiter la charge à 80%** : Utile si vous avez un iPhone 15 ou modèle supérieur pour doubler les cycles de longévité utile.",
    category: "Conseils",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    date: "2026-05-28",
    author: "Atelier Alpha+",
    readTime: "3 min"
  }
];

const INITIAL_STATS: DashboardStats = {
  visits: 1420,
  popularProductIds: { "iphone-16-pro": 340, "iphone-15-pro": 280, "iphone-17-pro": 190 },
  orderedItemCount: { "iphone-16-pro": 14, "iphone-15-pro": 10, "iphone-13": 8 },
  estimatedRevenueFCFA: 22840000,
  estimatedRevenueUSD: 37400
};

// Database state
interface DbSchema {
  products: Product[];
  orders: Order[];
  blog: BlogArticle[];
  stats: DashboardStats;
}

let db: DbSchema = {
  products: INITIAL_PRODUCTS,
  orders: [],
  blog: INITIAL_BLOG,
  stats: INITIAL_STATS
};

function readDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      db = JSON.parse(data);
    } else {
      writeDb();
    }
  } catch (err) {
    console.error("Could not read database. Using defaults.", err);
  }
}

function writeDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not write database.", err);
  }
}

// Read database immediately on launch
readDb();

async function run() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API - Auth Login for Back-Office
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    // Premium and simple default credential for Pointe-Noire store managers
    if (username === "admin" && password === "alpha242") {
      res.json({ success: true, token: "JWT-SECURED-ALPHA-STORE-TOKEN", user: { name: "Directeur Alpha+", role: "Administrateur" } });
    } else {
      res.status(401).json({ success: false, error: "Identifiants ou mot de passe incorrects. Utilisez admin / alpha242 !" });
    }
  });

  // API - Stats Endpoints
  app.get("/api/stats", (req, res) => {
    // Dynamically calculate estimated revenues from confirmed/delivered orders
    const confirmedOrders = db.orders.filter(o => o.status === "Confirmée" || o.status === "En préparation" || o.status === "Livrée");
    let totalRevenueFCFA = db.stats.estimatedRevenueFCFA;
    let totalRevenueUSD = db.stats.estimatedRevenueUSD;

    if (db.orders.length > 0) {
      const ordersSumFCFA = confirmedOrders.reduce((sum, o) => sum + o.totalFCFA, 0);
      const ordersSumUSD = confirmedOrders.reduce((sum, o) => sum + o.totalUSD, 0);
      totalRevenueFCFA = INITIAL_STATS.estimatedRevenueFCFA + ordersSumFCFA;
      totalRevenueUSD = INITIAL_STATS.estimatedRevenueUSD + ordersSumUSD;
    }

    res.json({
      visits: db.stats.visits,
      popularProductIds: db.stats.popularProductIds,
      orderedItemCount: db.stats.orderedItemCount,
      estimatedRevenueFCFA: totalRevenueFCFA,
      estimatedRevenueUSD: totalRevenueUSD
    });
  });

  app.post("/api/stats/visit", (req, res) => {
    db.stats.visits += 1;
    writeDb();
    res.json({ ok: true, visits: db.stats.visits });
  });

  app.post("/api/stats/view/:productId", (req, res) => {
    const id = req.params.productId;
    if (!db.stats.popularProductIds) db.stats.popularProductIds = {};
    db.stats.popularProductIds[id] = (db.stats.popularProductIds[id] || 0) + 1;
    writeDb();
    res.json({ ok: true });
  });

  // API - Products Endpoints
  app.get("/api/products", (req, res) => {
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const productData = req.body;
    if (!productData.name || !productData.series) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }
    
    const newProduct: Product = {
      ...productData,
      id: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      reviews: productData.reviews || [],
      priceFCFA: Number(productData.priceFCFA) || 0,
      priceUSD: Number(productData.priceUSD) || 0,
      stock: Number(productData.stock) || 0
    };

    db.products.push(newProduct);
    writeDb();
    res.json({ success: true, product: newProduct });
  });

  app.put("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Produit introuvable" });

    db.products[index] = {
      ...db.products[index],
      ...req.body,
      id // preserve ID
    };
    
    writeDb();
    res.json({ success: true, product: db.products[index] });
  });

  app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    
    if (db.products.length === initialLength) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    writeDb();
    res.json({ success: true });
  });

  // Add a review to a product
  app.post("/api/products/:id/review", (req, res) => {
    const id = req.params.id;
    const { author, rating, comment } = req.body;
    const product = db.products.find(p => p.id === id);
    
    if (!product) return res.status(404).json({ error: "Produit introuvable" });

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      author: author || "Client Anonyme",
      rating: Number(rating) || 5,
      comment: comment || "",
      date: new Date().toISOString().split("T")[0]
    };

    if (!product.reviews) product.reviews = [];
    product.reviews.push(newReview);
    writeDb();
    res.json({ success: true, review: newReview });
  });

  // API - Orders Endpoints (WhatsApp order logger)
  app.get("/api/orders", (req, res) => {
    res.json(db.orders);
  });

  app.post("/api/orders", (req, res) => {
    const { customerName, customerPhone, customerAddress, items, totalFCFA, totalUSD } = req.body;
    if (!customerName || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ error: "Détails de la commande invalides" });
    }

    const newOrder: Order = {
      id: "ALP-" + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerPhone,
      customerAddress: customerAddress || "Pointe-Noire, Congo",
      items,
      totalFCFA: Number(totalFCFA) || 0,
      totalUSD: Number(totalUSD) || 0,
      status: "En attente",
      date: new Date().toISOString().split("T")[0]
    };

    // Update dynamic stocks & telemetry stats
    newOrder.items.forEach(item => {
      // Find matches in products
      const p = db.products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
      
      // Popular clicks state update
      if (!db.stats.orderedItemCount) db.stats.orderedItemCount = {};
      db.stats.orderedItemCount[item.productId] = (db.stats.orderedItemCount[item.productId] || 0) + item.quantity;
    });

    db.orders.push(newOrder);
    writeDb();
    res.json({ success: true, order: newOrder });
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const order = db.orders.find(o => o.id === id);

    if (!order) return res.status(404).json({ error: "Commande introuvable" });
    
    order.status = status;
    writeDb();
    res.json({ success: true, order });
  });

  // API - Blog Articles Endpoints
  app.get("/api/blog", (req, res) => {
    res.json(db.blog);
  });

  app.post("/api/blog", (req, res) => {
    const blogData = req.body;
    if (!blogData.title || !blogData.content) {
      return res.status(400).json({ error: "Le titre et le contenu sont obligatoires" });
    }

    const newArticle: BlogArticle = {
      ...blogData,
      id: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      date: new Date().toISOString().split("T")[0],
      readTime: blogData.readTime || "4 min",
      author: blogData.author || "Equipe Alpha+"
    };

    db.blog.push(newArticle);
    writeDb();
    res.json({ success: true, article: newArticle });
  });

  app.put("/api/blog/:id", (req, res) => {
    const id = req.params.id;
    const index = db.blog.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: "Article introuvable" });

    db.blog[index] = {
      ...db.blog[index],
      ...req.body,
      id // preserve ID
    };

    writeDb();
    res.json({ success: true, article: db.blog[index] });
  });

  app.delete("/api/blog/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = db.blog.length;
    db.blog = db.blog.filter(a => a.id !== id);

    if (db.blog.length === initialLength) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    writeDb();
    res.json({ success: true });
  });

  // Helper to proxy video stream safely following multiple HTTP redirects
  function proxyVideoStream(url: string, clientRes: express.Response, depth = 0) {
    if (depth > 5) {
      return clientRes.status(500).send("Trop d'unions de redirections de vidéo");
    }
    https.get(url, (response) => {
      const statusCode = response.statusCode || 200;
      if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
        return proxyVideoStream(response.headers.location, clientRes, depth + 1);
      }
      
      clientRes.setHeader("Content-Type", "video/mp4");
      clientRes.setHeader("Access-Control-Allow-Origin", "*");
      clientRes.setHeader("Cache-Control", "public, max-age=86400");
      if (response.headers["content-length"]) {
        clientRes.setHeader("Content-Length", response.headers["content-length"]);
      }
      
      response.pipe(clientRes);
    }).on("error", (err) => {
      console.error("Erreur de proxy de la vidéo Hero:", err);
      clientRes.status(500).send("Échec du streaming vidéo");
    });
  }

  // Local premium proxy endpoint for the incredible concept video to pass frame restrictions
  app.get("/api/hero-video", (req, res) => {
    const videoUrl = "https://cdn.qwenlm.ai/output/6bf1ab8c-9d18-410b-9159-ee845c528e0d/t2v/9940b36b-d6be-4888-8579-9b857e7b1965/cd585a25-e775-40f4-babf-63361ce9fb32.mp4?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiNmJmMWFiOGMtOWQxOC00MTBiLTkxNTktZWU4NDVjNTI4ZTBkIiwicmVzb3VyY2VfaWQiOiJjZDU4NWEyNS1lNzc1LTQwZjQtYmFiZi02MzM2MWNlOWZiMzIiLCJyZXNvdXJjZV9jaGF0X2lkIjpudWxsfQ.pTWwjhuAGDgcPwItBmI2XiJjYZ7Ft-1SJv690iEnsKI";
    proxyVideoStream(videoUrl, res);
  });

  // 1. POST /api/generate-video -> Starts premium video rendering
  app.post("/api/generate-video", async (req, res) => {
    try {
      const aiClient = getGeai();
      const prompt = req.body.prompt || "A cinematic Apple-style commercial of a luxurious, floating, emerald green iPhone 17 with micro-borders and reflective glass panel. Dark abstract studio background with gold backlit, ultimate luxury packaging, high fidelity 3D product catalog render, 60fps.";
      
      const operation = await aiClient.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });
      
      res.json({ success: true, operationName: operation.name });
    } catch (err: any) {
      console.error("Échec du démarrage de Veo 3:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message || "Impossible de démarrer la modélisation Veo 3. Vérifiez la clé API." 
      });
    }
  });

  // 2. POST /api/video-status -> Polls video rendering status
  app.post("/api/video-status", async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "Nom de l'opération requis" });
      }
      
      const aiClient = getGeai();
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await aiClient.operations.getVideosOperation({ operation: op });
      res.json({ success: true, done: updated.done, error: updated.error });
    } catch (err: any) {
      console.error("Échec de récupération du statut de l'opération Veo:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. POST /api/video-download -> Downloads the full arrayBuffer from uri and streams it to client
  app.post("/api/video-download", async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: "Nom de l'opération requis" });
      }
      
      const aiClient = getGeai();
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await aiClient.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!uri) {
        return res.status(404).json({ error: "La vidéo n'est pas encore terminée ou l'URI est indisponible." });
      }
      
      const key = process.env.GEMINI_API_KEY || '';
      const response = await fetch(uri, {
        headers: { 'x-goog-api-key': key },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement de la vidéo depuis le CDN de Google: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(buffer);
    } catch (err: any) {
      console.error("Erreur de téléchargement et stream de la vidéo:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Serve static assets in development / production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Alpha+ FullStack] Server listening on http://0.0.0.0:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Failed to start Alpha+ FullStack Server", err);
});
