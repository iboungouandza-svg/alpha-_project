export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  series: 'iPhone 13' | 'iPhone 13 Pro' | 'iPhone 14' | 'iPhone 14 Pro' | 'iPhone 15' | 'iPhone 15 Pro' | 'iPhone 16' | 'iPhone 16 Pro' | 'iPhone 17' | 'iPhone 17 Pro';
  description: string;
  priceFCFA: number;
  priceUSD: number;
  stock: number;
  colors: string[];
  storage: string[];
  images: string[];
  screen: string;
  processor: string;
  ram: string;
  battery: string;
  camera: string;
  isFeatured: boolean;
  isNew: boolean;
  isPromo: boolean;
  promoPriceFCFA?: number;
  promoPriceUSD?: number;
  reviews: Review[];
  ratingOverride?: number;
  reviewsCountOverride?: number;
  badgeOverride?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  storage: string;
  quantity: number;
  priceFCFA: number;
  priceUSD: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalFCFA: number;
  totalUSD: number;
  status: 'En attente' | 'Confirmée' | 'En préparation' | 'Livrée' | 'Annulée';
  date: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Actualités Apple' | 'Conseils' | 'Comparatifs' | 'Guides d\'achat';
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface DashboardStats {
  visits: number;
  popularProductIds: Record<string, number>;
  orderedItemCount: Record<string, number>;
  estimatedRevenueFCFA: number;
  estimatedRevenueUSD: number;
}

const PRODUCT_IMAGES: Record<string, string> = {
  "iphone-13": "/src/assets/images/iphone_13_base_1781480605495.jpg",
  "iphone-13-pro": "/src/assets/images/iphone_13_pro_1781480618885.jpg",
  "iphone-14": "/src/assets/images/iphone_14_base_1781480630796.jpg",
  "iphone-14-pro": "/src/assets/images/iphone_14_pro_1781480645203.jpg",
  "iphone-15": "/src/assets/images/iphone_15_base_1781480657838.jpg",
  "iphone-15-pro": "/src/assets/images/iphone_15_pro_1781480674823.jpg",
  "iphone-16": "/src/assets/images/iphone_16_base_1781480688700.jpg",
  "iphone-16-pro": "/src/assets/images/iphone_16_pro_1781480701820.jpg",
  "iphone-17": "/src/assets/images/iphone_17_base_1781480715720.jpg",
  "iphone-17-pro": "/src/assets/images/iphone_17_pro_1781480730754.jpg"
};

export function getProductImage(productId: string): string {
  return PRODUCT_IMAGES[productId] || "/src/assets/images/iphones_showcase_1781480409570.jpg";
}
