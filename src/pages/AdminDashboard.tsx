import React, { useState } from "react";
import { 
  Key, Shield, BarChart3, Package, ShoppingCart, FileText, 
  Plus, Edit, Trash2, Check, AlertTriangle, RefreshCw, KeyRound, 
  Smartphone, User, MapPin, Phone, LogOut, TrendingUp, DollarSign
} from "lucide-react";
import { Product, Order, BlogArticle, DashboardStats } from "../types";

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  articles: BlogArticle[];
  stats: DashboardStats;
  isAdmin: boolean;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  onAddArticle: (articleData: Partial<BlogArticle>) => Promise<void>;
  onUpdateArticle: (id: string, articleData: Partial<BlogArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
}

export default function AdminDashboard({
  products,
  orders,
  articles,
  stats,
  isAdmin,
  onLogin,
  onLogout,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle
}: AdminDashboardProps) {
  // Login Panel State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  // Active Admin Tab Category Selection
  const [activeAdminTab, setActiveAdminTab] = useState<"stats" | "products" | "orders" | "blog">("stats");

  // Sub module Action States (CRUD drawers)
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    series: "iPhone 16 Pro",
    description: "",
    priceFCFA: 650000,
    priceUSD: 1060,
    stock: 10,
    colors: ["Minuit", "Argent", "Jaune"],
    storage: ["128 Go", "256 Go"],
    screen: "6.1 pouces Super Retina XDR",
    processor: "A18 Bionic",
    ram: "8 Go",
    battery: "3561 mAh",
    camera: "Fusion 48Mpx"
  });

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<BlogArticle>>({
    title: "",
    excerpt: "",
    content: "",
    category: "Actualités Apple",
    readTime: "4 min"
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (loginUsername !== "admin") {
      setLoginError("Identifiant incorrect. Utilisez 'admin'.");
      return;
    }

    setAuthenticating(true);
    const success = await onLogin(loginPassword);
    setAuthenticating(false);

    if (!success) {
      setLoginError("Code de sécurité incorrect. Conseil : utilisez 'alpha242' !");
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage("");
    try {
      if (editingProductId) {
        await onUpdateProduct(editingProductId, productForm);
        setFormSuccessMessage("Produit mis à jour avec succès !");
      } else {
        await onAddProduct(productForm);
        setFormSuccessMessage("Produit ajouté à l'inventaire avec succès !");
      }
      
      // Reset
      setEditingProductId(null);
      setProductForm({
        name: "",
        series: "iPhone 16 Pro",
        description: "",
        priceFCFA: 650000,
        priceUSD: 1060,
        stock: 10,
        colors: ["Minuit", "Sable", "Titane"],
        storage: ["128 Go", "256 Go"],
        screen: "6.1 pouces OLED",
        processor: "A18",
        ram: "8 Go",
        battery: "3500 mAh",
        camera: "48 Mpx"
      });
      setTimeout(() => setFormSuccessMessage(""), 4000);
    } catch (err) {
      setLoginError("Erreur d'enregistrement.");
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage("");
    try {
      if (editingArticleId) {
        await onUpdateArticle(editingArticleId, articleForm);
        setFormSuccessMessage("Article de blog mis à jour !");
      } else {
        await onAddArticle(articleForm);
        setFormSuccessMessage("Nouvel article de blog publié avec succès !");
      }
      
      setEditingArticleId(null);
      setArticleForm({ title: "", excerpt: "", content: "", category: "Actualités Apple", readTime: "4 min" });
      setTimeout(() => setFormSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Check low stock count
  const lowStockProducts = products.filter(p => p.stock <= 3);

  // If Admin is unauthorized, display the standard Secure Portal Login screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4" id="admin-login-screen">
        <form onSubmit={handleLoginSubmit} className="bg-white border rounded-3xl p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="bg-brand-blue text-white p-3.5 rounded-full inline-block shadow-lg">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-zinc-900">Portail Administratif Alpha+</h1>
            <p className="text-2xs text-zinc-400">Authentification requise pour charger l'inventaire et les rapports financiers.</p>
          </div>

          {loginError && (
            <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs text-center font-bold">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Identifiant</label>
              <input
                type="text"
                required
                placeholder="Identifiant administrateur (admin)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">Code Secret de Boutique</label>
              <input
                type="password"
                required
                placeholder="Ex : alpha242"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authenticating}
            className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase cursor-pointer"
          >
            {authenticating ? "Accès en cours..." : "Se connecter en toute sécurité"}
          </button>

          <p className="text-[10px] text-center text-zinc-400 leading-normal border-t border-zinc-100 pt-3">
            🔐 Astuce de test : Utilisez <span className="font-bold text-zinc-700">admin</span> comme identifiant et <span className="font-bold text-zinc-700">alpha242</span> comme mot de passe.
          </p>
        </form>
      </div>
    );
  }

  // AUTHORIZED USER INTERFACES
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="authorized-admin-dashboard">
      
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Espace d'Administration d'Élite
          </span>
          <h1 className="text-3xl font-black text-zinc-900 mt-2">Tableau de Bord Alpha+</h1>
        </div>

        <button
          onClick={onLogout}
          className="bg-zinc-100 hover:bg-rose-50 text-zinc-600 hover:text-rose-500 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition-colors border"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Fermer la session</span>
        </button>
      </div>

      {/* Sub tabs list navigation */}
      <nav className="flex flex-wrap gap-2 bg-zinc-100 p-1.5 rounded-2xl" id="admin-subnavigation">
        {[
          { id: "stats", label: "Statistiques & Finance", icon: BarChart3 },
          { id: "products", label: "Gestion Produits", icon: Package },
          { id: "orders", label: "Gestion Commandes", icon: ShoppingCart },
          { id: "blog", label: "Gestion Blog", icon: FileText }
        ].map((tab) => {
          const isActive = activeAdminTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveAdminTab(tab.id as any);
                setEditingProductId(null);
                setEditingArticleId(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <TabIcon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Banner / Success notification */}
      {formSuccessMessage && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-2xl text-xs font-bold animate-fade-in text-center">
          {formSuccessMessage}
        </div>
      )}


      {/* SECTION 1: STATS & CORPORATE BUSINESS METRICS */}
      {activeAdminTab === "stats" && (
        <div className="space-y-8 animate-fade-in" id="admin-module-stats">
          
          {/* Main numeric counters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white border p-6 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Trafic de Clicks</span>
              <span className="text-3xl font-black text-zinc-900 block font-mono">{stats.visits} v.</span>
              <div className="text-[11px] text-zinc-500 mt-2">Visites directes et interactions cataloguées.</div>
            </div>

            <div className="bg-white border p-6 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Volume Commandes</span>
              <span className="text-3xl font-black text-zinc-900 block font-mono">{orders.length}</span>
              <div className="text-[11px] text-zinc-500 mt-2">
                <span className="text-emerald-600 font-bold">{orders.filter(o => o.status === "Livrée").length} livrées</span> • 
                <span className="text-amber-500 font-bold"> {orders.filter(o => o.status === "En attente").length} en attente</span>
              </div>
            </div>

            <div className="bg-white border p-6 rounded-3xl space-y-1 bg-gradient-to-br from-blue-50/20 to-zinc-50 border-brand-blue/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue">Chiffre d’Affaires Estimé</span>
              <span className="text-3xl font-black text-brand-blue block font-mono">
                {stats.estimatedRevenueFCFA.toLocaleString("fr-FR")} F
              </span>
              <div className="text-[11px] text-zinc-600 mt-2 font-semibold">Equivalent approximatif: ${stats.estimatedRevenueUSD.toLocaleString()} USD</div>
            </div>

            <div className="bg-white border p-6 rounded-3xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ruptures & Alertes</span>
              <span className="text-3xl font-black text-rose-500 block font-mono">
                {lowStockProducts.length}
              </span>
              <div className="text-[11px] text-zinc-500 mt-2">Téléphones en alerte de stock inférieur à 3 unités.</div>
            </div>

          </div>

          {/* Sub statistics charts sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Popular items viewing metrics */}
            <div className="bg-white border p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-extrabold uppercase text-zinc-900">iPhones les plus cliqués (Popularité)</h3>
                <TrendingUp className="h-4.5 w-4.5 text-brand-blue" />
              </div>
              
              <div className="space-y-3.5 text-xs">
                {Object.entries(stats.popularProductIds || {})
                  .sort((a,b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([prodId, count], idx) => {
                    const match = products.find(p => p.id === prodId);
                    return (
                      <div key={prodId} className="space-y-1.5">
                        <div className="flex justify-between items-center font-medium">
                          <span className="text-zinc-800">{match ? match.name : prodId}</span>
                          <span className="font-mono text-zinc-500">{count} clics</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-blue h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (count / 350) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right: Items ordered counters */}
            <div className="bg-white border p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-extrabold uppercase text-zinc-900">iPhones les plus commandés</h3>
                <DollarSign className="h-4.5 w-4.5 text-brand-blue" />
              </div>

              <div className="space-y-3.5 text-xs">
                {Object.entries(stats.orderedItemCount || {})
                  .sort((a,b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([prodId, qty]) => {
                    const match = products.find(p => p.id === prodId);
                    return (
                      <div key={prodId} className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                        <span className="font-extrabold text-zinc-800">{match ? match.name : prodId}</span>
                        <div className="text-right">
                          <span className="font-mono font-black text-zinc-900 bg-white border px-2.5 py-1 rounded-md text-xs">{qty} unités</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* SECTION 2: PRODUCTS MANAGER (CRUD) */}
      {activeAdminTab === "products" && (
        <div className="space-y-8 animate-fade-in" id="admin-module-products">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-extrabold uppercase text-zinc-500 tracking-wider">
              {editingProductId ? "Modifier l'iPhone" : "Ajouter un iPhone au catalogue"}
            </h2>

            {editingProductId && (
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({ name: "", series: "iPhone 16 Pro", priceFCFA: 650000, priceUSD: 1060, stock: 10 });
                }}
                className="text-xs text-brand-blue underline"
              >
                Annuler l'édition (Créer un nouveau)
              </button>
            )}
          </div>

          {/* Create/Edit Product Form */}
          <form onSubmit={handleProductSubmit} className="bg-white border rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Modèle exact *</label>
              <input
                type="text"
                required
                placeholder="Ex : iPhone 16 Pro Max, iPhone 17 (Nouveauté)"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-850 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Série officielle *</label>
              <select
                value={productForm.series}
                onChange={(e) => setProductForm({ ...productForm, series: e.target.value as any })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 outline-none"
              >
                <option value="iPhone 13">iPhone 13</option>
                <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                <option value="iPhone 14">iPhone 14</option>
                <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                <option value="iPhone 15">iPhone 15</option>
                <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                <option value="iPhone 16">iPhone 16</option>
                <option value="iPhone 16 Pro">iPhone 16 Pro</option>
                <option value="iPhone 17">iPhone 17</option>
                <option value="iPhone 17 Pro">iPhone 17 Pro</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Finitons dominantes (séparées par virgules)</label>
              <input
                type="text"
                placeholder="Ex : Minuit, Argent, Titane Sable"
                value={productForm.colors?.join(", ")}
                onChange={(e) => setProductForm({ ...productForm, colors: e.target.value.split(",").map(c => c.trim()) })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Prix à Pointe-Noire (FCFA) *</label>
              <input
                type="number"
                required
                value={productForm.priceFCFA}
                onChange={(e) => setProductForm({ ...productForm, priceFCFA: Number(e.target.value) })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Prix USD ($) *</label>
              <input
                type="number"
                required
                value={productForm.priceUSD}
                onChange={(e) => setProductForm({ ...productForm, priceUSD: Number(e.target.value) })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-1">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Quantité d'unités en Stock *</label>
              <input
                type="number"
                required
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
              />
            </div>

            <div className="space-y-1.5 col-span-3">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Description narrative du produit *</label>
              <textarea
                required
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={3}
                placeholder="Rédigez un paragraphe sur les atouts du téléphone (mode cinématique, boutons d'appareil, bionic, autonomie)..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-800 outline-none resize-none"
              />
            </div>

            <div className="col-span-3 border-t border-zinc-100 pt-4">
              <button
                type="submit"
                className="bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-8 rounded-2xl text-xs uppercase cursor-pointer"
              >
                {editingProductId ? "Sauvegarder l'iPhone" : "Ajouter au catalogue Alpha+"}
              </button>
            </div>

          </form>

          {/* Current products inventory summary table */}
          <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-zinc-50 p-4 font-extrabold text-xs text-zinc-500 uppercase border-b bg-gradient-to-r from-zinc-50 to-zinc-100 flex justify-between items-center">
              <span>Inventaire des produits ({products.length} références)</span>
              <span className="text-[10px] text-zinc-400 font-mono">Faible stock alertes: &lt;= 3 unités</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-xs">
                
                <thead>
                  <tr className="bg-zinc-50/50 text-zinc-600 font-bold">
                    <th className="p-4 text-left">Modèle</th>
                    <th className="p-4 text-left">Série</th>
                    <th className="p-4 text-right">Prix (FCFA)</th>
                    <th className="p-4 text-right">Prix (USD)</th>
                    <th className="p-4 text-center">Quantité</th>
                    <th className="p-4 text-center">Statut</th>
                    <th className="p-4 text-center">Outils</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200 text-zinc-800">
                  {products.map((p) => {
                    const isLow = p.stock <= 3;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/20">
                        <td className="p-4 font-extrabold text-zinc-900">{p.name}</td>
                        <td className="p-4 text-zinc-500">{p.series}</td>
                        <td className="p-4 text-right font-bold font-mono">{p.priceFCFA.toLocaleString()} FCFA</td>
                        <td className="p-4 text-right font-mono">${p.priceUSD.toLocaleString()}</td>
                        <td className="p-4 text-center font-bold font-mono">{p.stock} p.</td>
                        <td className="p-4 text-center">
                          {p.stock === 0 ? (
                            <span className="inline-block bg-zinc-100 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full border">Rupture</span>
                          ) : isLow ? (
                            <span className="inline-block bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">Alerte</span>
                          ) : (
                            <span className="inline-block bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">Ok</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingProductId(p.id);
                                setProductForm(p);
                                window.scrollTo({ top: 300, behavior: "smooth" });
                              }}
                              className="p-1 hover:bg-zinc-100 text-blue-500 rounded-lg transition-colors border"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer l'iPhone "${p.name}" définitivement ?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors border"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      )}


      {/* SECTION 3: ORDERS REVIEWER */}
      {activeAdminTab === "orders" && (
        <div className="space-y-8 animate-fade-in" id="admin-module-orders">
          
          <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-zinc-50 p-4 font-extrabold text-xs text-zinc-500 uppercase border-b flex justify-between items-center">
              <span>Commandes d'iPhones ({orders.length} ordres logs)</span>
              <span className="text-[10px] text-zinc-400 font-mono">Modifiez les statuts et validez les livraisons.</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 italic">
                Aucune commande n'a encore été enregistrée sur le site. Les commandes de test apparaîtront ici.
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start text-xs hover:bg-zinc-50/20">
                    
                    {/* Buyer column coordinates */}
                    <div className="space-y-2 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono bg-zinc-900 text-white rounded text-[11px] px-2 py-0.5">{ord.id}</span>
                        <span className="text-zinc-400">{ord.date}</span>
                      </div>
                      
                      <div className="space-y-1 font-medium text-zinc-700">
                        <div className="flex items-center text-zinc-950 font-bold">
                          <User className="h-3.5 w-3.5 text-zinc-400 mr-1.5" />
                          <span>{ord.customerName}</span>
                        </div>
                        <div className="flex items-center font-mono">
                          <Phone className="h-3.5 w-3.5 text-zinc-400 mr-1.5" />
                          <span>{ord.customerPhone}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400 mr-1.5 shrink-0 mt-0.5" />
                          <span className="break-words leading-relaxed">{ord.customerAddress}</span>
                        </div>
                      </div>
                    </div>

                    {/* Basket items list */}
                    <div className="flex-1 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">Panier commandé</h4>
                      <div className="space-y-1.5 bg-zinc-50 p-3 rounded-2xl border">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-medium text-zinc-800 text-xs">
                            <span>
                              {item.productName} ({item.color} • {item.storage}) <span className="font-bold text-brand-blue font-mono">x{item.quantity}</span>
                            </span>
                            <span className="font-mono text-zinc-600">{(item.priceFCFA * item.quantity).toLocaleString()} FCFA</span>
                          </div>
                        ))}
                        
                        <div className="border-t border-dashed border-zinc-200 mt-2 pt-2 flex justify-between font-bold text-zinc-950">
                          <span>Montant global :</span>
                          <span className="font-mono text-brand-blue">{ord.totalFCFA.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Status manager dropdown */}
                    <div className="space-y-2 shrink-0 md:text-right w-full md:w-auto">
                      <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider block">Statut de livraison</span>
                      
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                        className={`font-semibold text-xs rounded-xl px-3 py-2 border outline-none text-zinc-800 ${
                          ord.status === "Livrée" ? "bg-emerald-50 border-emerald-300 text-emerald-700" :
                          ord.status === "En attente" ? "bg-rose-50 border-rose-300 text-rose-700" :
                          ord.status === "Confirmée" ? "bg-blue-50 border-blue-300 text-blue-700" :
                          ord.status === "Annulée" ? "bg-zinc-100 border-zinc-300 text-zinc-600" :
                          "bg-amber-50 border-amber-300 text-amber-700"
                        }`}
                      >
                        <option value="En attente">En attente (WhatsApp)</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
                      </select>

                      <p className="text-[10px] text-zinc-400 mt-1">Estimations financières calculées automatiquement.</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}


      {/* SECTION 4: BLOG ARTICLES WRITER */}
      {activeAdminTab === "blog" && (
        <div className="space-y-8 animate-fade-in" id="admin-module-blog">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-extrabold uppercase text-zinc-500 tracking-wider">
              {editingArticleId ? "Modifier l’Article de Blog" : "Publier un nouvel Article"}
            </h2>
            {editingArticleId && (
              <button
                onClick={() => {
                  setEditingArticleId(null);
                  setArticleForm({ title: "", excerpt: "", content: "", category: "Actualités Apple", readTime: "4 min" });
                }}
                className="text-xs text-brand-blue underline"
              >
                Annuler l’édition (Rédiger un nouvel article)
              </button>
            )}
          </div>

          {/* Form Composer */}
          <form onSubmit={handleArticleSubmit} className="bg-white border rounded-3xl p-6 md:p-8 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Titre de l’article *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Top 3 des nouveautés de l'iPhone 17 Pro..."
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Catégorie *</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value as any })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-700 outline-none"
                >
                  <option value="Actualités Apple">Actualités Apple</option>
                  <option value="Conseils">Conseils</option>
                  <option value="Comparatifs">Comparatifs</option>
                  <option value="Guides d'achat">Guides d'achat</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Résumé court (Excerpt) *</label>
              <input
                type="text"
                required
                placeholder="Rédigez une phrase accrocheuse pour la carte du blog..."
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold text-zinc-500 uppercase">Corps textuel complet *</label>
                <span className="text-[10px] text-zinc-400">Utilisez double saut de ligne pour créer des paragraphes.</span>
              </div>
              <textarea
                required
                rows={6}
                placeholder="Rédigez le texte global de l'article de blog..."
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-800 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-black hover:bg-zinc-800 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase cursor-pointer"
            >
              {editingArticleId ? "Enregistrer les modifications" : "Publier l'article en ligne"}
            </button>

          </form>

          {/* List current blogs articles to manage */}
          <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-zinc-50 p-4 font-extrabold text-xs text-zinc-500 uppercase border-b">
              Articles publiés ({articles.length} posts)
            </div>

            <div className="divide-y divide-zinc-200 text-xs">
              {articles.map((art) => (
                <div key={art.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/20">
                  <div>
                    <h4 className="font-extrabold text-zinc-900 text-sm">{art.title}</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">{art.category} • Publié le {art.date} par {art.author}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingArticleId(art.id);
                        setArticleForm(art);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="p-1 hover:bg-zinc-100 text-blue-500 rounded-lg transition-colors border"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm("Supprimer cet article définitivement ?")) {
                          onDeleteArticle(art.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors border"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
