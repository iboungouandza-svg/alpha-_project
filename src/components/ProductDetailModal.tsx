import React, { useState } from "react";
import { X, ShoppingCart, MessageCircle, Star, ShieldCheck, Box, Milestone, RefreshCw, Send } from "lucide-react";
import { Product, Review, getProductImage } from "../types";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, storage: string, quantity: number) => void;
  onOrderWhatsApp: (product: Product, color: string, storage: string, quantity: number) => void;
  onAddReview: (productId: string, author: string, rating: number, comment: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onOrderWhatsApp,
  onAddReview,
  allProducts,
  onSelectProduct,
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "Standard");
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0] || "128 Go");
  const [quantity, setQuantity] = useState(1);
  
  // Custom Review Form State
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Active color background visualization
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const getActiveHexColor = () => {
    // Return approximate hex colors for render styling
    const colorLower = selectedColor.toLowerCase();
    if (colorLower.includes("noir") || colorLower.includes("minuit")) return "#171717";
    if (colorLower.includes("blanc") || colorLower.includes("saphir")) return "#f5f5f5";
    if (colorLower.includes("naturel")) return "#a8a29e";
    if (colorLower.includes("bleu") || colorLower.includes("outremer")) return "#1d4ed8";
    if (colorLower.includes("violet")) return "#4c1d95";
    if (colorLower.includes("sable") || colorLower.includes("or")) return "#ca8a04";
    if (colorLower.includes("vert") || colorLower.includes("émeraude")) return "#064e3b";
    if (colorLower.includes("rose")) return "#f43f5e";
    return "#3b82f6";
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, reviewAuthor, reviewRating, reviewComment);
    setReviewSuccess(true);
    setReviewAuthor("");
    setReviewComment("");
    setReviewRating(5);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const currentPriceFCFA = product.isPromo && product.promoPriceFCFA ? product.promoPriceFCFA : product.priceFCFA;
  const currentPriceUSD = product.isPromo && product.promoPriceUSD ? product.promoPriceUSD : product.priceUSD;

  // Find similar products of same series or range
  const similarProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-zinc-900 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl relative animate-scale-up" id="product-detail-modal">
        
        {/* Close Button Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-2 rounded-full transition-colors"
          id="close-modal-button"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left panel: Advanced Gallery & interactive visualization */}
          <div className="bg-zinc-950 p-6 md:p-12 flex flex-col justify-between text-white relative">
            <div className="absolute top-4 left-4 bg-zinc-900 px-3 py-1 rounded-full text-xs text-brand-blue font-semibold border border-zinc-800">
              {product.series}
            </div>

            {/* Real high-res model visualization */}
            <div className="my-auto py-6 flex flex-col items-center w-full">
              <div className="w-64 aspect-[3/4] rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl bg-black relative group">
                <img
                  src={getProductImage(product.id)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay chip of specs */}
                <div className="absolute bottom-4 inset-x-4 bg-zinc-950/85 backdrop-blur-md border border-zinc-800 rounded-2xl p-3 text-center">
                  <div className="text-xs font-black text-white">{product.name}</div>
                  <div className="text-[9px] text-[#2563EB] font-bold uppercase mt-0.5 tracking-wider font-mono">
                    {product.processor} • {product.screen.split(" ")[0]}
                  </div>
                </div>
              </div>

              {/* Color label bubble */}
              <p className="mt-4 text-[11px] text-zinc-400">
                Finition sélectionnée : <span className="text-white font-extrabold">{selectedColor}</span>
              </p>
            </div>

            {/* Badges footer */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-900 text-center text-[10px] text-zinc-400">
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-4 w-4 text-brand-blue mb-1" />
                <span>Garantie 1 An</span>
              </div>
              <div className="flex flex-col items-center">
                <Box className="h-4 w-4 text-brand-blue mb-1" />
                <span>100% Original</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="h-4 w-4 text-brand-blue mb-1" />
                <span>SAV Express</span>
              </div>
            </div>
          </div>


          {/* Right panel: Details & ordering controls */}
          <div className="p-6 md:p-10 max-h-[85vh] overflow-y-auto space-y-6">
            
            <div>
              {product.isNew && (
                <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block mr-1">
                  Nouveauté
                </span>
              )}
              {product.isPromo && (
                <span className="bg-rose-100 text-rose-600 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block mr-1">
                  Offre Spéciale
                </span>
              )}
              {product.badgeOverride && (
                <span className="bg-blue-900/10 text-[#2563EB] text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block">
                  {product.badgeOverride}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mt-2">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2 mt-1.5 text-xs">
                <p className="text-zinc-500">Série : <span className="font-semibold text-zinc-700">{product.series}</span></p>
                <span className="text-zinc-300">•</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingVal = product.ratingOverride || 4.5;
                    const isFull = i < Math.floor(ratingVal);
                    return (
                      <Star key={i} className={`h-3 w-3 ${isFull ? "fill-amber-500 text-amber-500" : "text-zinc-300"}`} />
                    );
                  })}
                  <span className="ml-1 text-zinc-800 font-extrabold font-mono text-[11px]">
                    {(product.ratingOverride || 4.5).toFixed(1)}
                  </span>
                  <span className="ml-1 text-zinc-500">
                    ({product.reviewsCountOverride || 15} avis)
                  </span>
                </div>
              </div>
            </div>

            {/* Prices section */}
            <div className="bg-zinc-50 p-4 rounded-2xl flex items-center justify-between border border-zinc-100">
              <div>
                <span className="text-xs text-zinc-500 block">Prix à Pointe-Noire</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-brand-blue">
                    {currentPriceFCFA.toLocaleString("fr-FR")} FCFA
                  </span>
                  {product.isPromo && product.promoPriceFCFA && (
                    <span className="text-sm text-zinc-400 line-through">
                      {product.priceFCFA.toLocaleString("fr-FR")} FCFA
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right border-l border-zinc-200 pl-4">
                <span className="text-xs text-zinc-500 block">Équivalent USD</span>
                <span className="text-lg font-bold text-zinc-700">
                  ${currentPriceUSD.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Présentation</h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interatice Selectors: Capacity / Storage */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Capacité de Stockage</h4>
              <div className="flex flex-wrap gap-2">
                {product.storage.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                      selectedStorage === st
                        ? "bg-black text-white border-black shadow"
                        : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Selectors */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sélectionner la Finition</h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected 
                          ? "border-brand-blue bg-blue-50/50 text-brand-blue font-bold" 
                          : "border-zinc-200 hover:border-zinc-400 text-zinc-700"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-sm" style={{
                        backgroundColor: color.includes("Minuit") || color.includes("Noir") ? "#262626" :
                                         color.includes("Blanc") || color.includes("Saphir") ? "#f4f4f5" :
                                         color.includes("Naturel") || color.includes("Gris") ? "#a8a29e" :
                                         color.includes("Bleu") ? "#2563eb" :
                                         color.includes("Pourpre") || color.includes("Violet") ? "#6d28d9" :
                                         color.includes("Sable") || color.includes("Or") ? "#eab308" :
                                         color.includes("Rose") ? "#f43f5e" : "#3b82f6"
                      }} />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specs Accordion Content */}
            <div className="border border-zinc-100 rounded-2xl overflow-hidden text-xs">
              <div className="bg-zinc-50 px-4 py-2.5 font-bold text-zinc-700 border-b border-zinc-100">
                Caractéristiques Techniques :
              </div>
              <div className="divide-y divide-zinc-100 bg-white">
                <div className="grid grid-cols-3 p-3">
                  <span className="text-zinc-500 font-medium">Écran</span>
                  <span className="col-span-2 text-zinc-800 font-semibold">{product.screen}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-zinc-500 font-medium">Puce</span>
                  <span className="col-span-2 text-zinc-800 font-semibold">{product.processor}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-zinc-500 font-medium font-mono">RAM</span>
                  <span className="col-span-2 text-zinc-800 font-semibold">{product.ram}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-zinc-500 font-medium">Batterie</span>
                  <span className="col-span-2 text-zinc-800 font-semibold">{product.battery}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-zinc-500 font-medium">Appareil Photo</span>
                  <span className="col-span-2 text-zinc-800 font-semibold">{product.camera}</span>
                </div>
              </div>
            </div>

            {/* Quantities & stocks status */}
            <div className="flex items-center justify-between border-t border-b border-zinc-100 py-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Quantité</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-zinc-500 uppercase block mb-1">Disponibilité</span>
                {product.stock === 0 ? (
                  <span className="inline-block bg-zinc-100 text-zinc-500 text-xs font-bold px-3 py-1 rounded-full border border-zinc-200">
                    Rupture de Stock
                  </span>
                ) : product.stock <= 3 ? (
                  <span className="inline-block bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                    Stock Faible ({product.stock} restants)
                  </span>
                ) : (
                  <span className="inline-block bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    Stock Disponible ({product.stock})
                  </span>
                )}
              </div>
            </div>

            {/* Actions Triggers / Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onAddToCart(product, selectedColor, selectedStorage, quantity);
                }}
                disabled={product.stock === 0}
                className="flex items-center justify-center space-x-2 bg-black hover:bg-zinc-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={() => {
                  onOrderWhatsApp(product, selectedColor, selectedStorage, quantity);
                }}
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-emerald-600/10"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Achat WhatsApp Direct</span>
              </button>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-zinc-100 pt-6 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-500">
                Avis Clients ({product.reviews?.length || 0})
              </h3>

              {/* Reviews List */}
              <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">{rev.author}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-zinc-400 block text-right">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">Aucun avis pour l'instant. Soyez le premier à partager votre expérience !</p>
                )}
              </div>

              {/* Leave a review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-3">
                <h4 className="text-xs font-bold text-zinc-700">Donner votre avis :</h4>
                
                {reviewSuccess && (
                  <div className="bg-emerald-50 text-emerald-600 p-2 text-xs rounded-xl font-bold border border-emerald-100 text-center animate-fade-in">
                    Merci ! Votre avis a été enregistré avec succès.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue text-zinc-800"
                  />

                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="bg-white border border-zinc-200 rounded-xl px-2 py-2 text-xs outline-none focus:border-brand-blue text-zinc-700"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>

                <div className="relative">
                  <textarea
                    required
                    placeholder="Partagez vos impressions sur cet iPhone..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={2}
                    className="bg-white border border-zinc-200 rounded-xl w-full p-3 text-xs outline-none focus:border-brand-blue text-zinc-800 resize-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bottom-3 bg-brand-blue text-white p-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Related products */}
            <div className="border-t border-zinc-100 pt-6 space-y-4">
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-zinc-500">Suggestion de modèles</h4>
              <div className="grid grid-cols-3 gap-3">
                {similarProducts.map((p) => {
                  const pPrice = p.isPromo && p.promoPriceFCFA ? p.promoPriceFCFA : p.priceFCFA;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setSelectedColor(p.colors[0] || "Standard");
                        setSelectedStorage(p.storage[0] || "128 Go");
                        setQuantity(1);
                        setActiveImgIndex(0);
                      }}
                      className="bg-zinc-50 hover:bg-zinc-100 p-3 rounded-2xl border border-zinc-100 text-center cursor-pointer transition-all hover:scale-102"
                    >
                      <span className="text-[10px] font-bold text-zinc-400 block shrink-0">{p.series}</span>
                      <span className="text-xs font-bold text-zinc-800 line-clamp-1 mt-1">{p.name}</span>
                      <span className="text-xs font-black text-brand-blue block mt-1.5">
                        {pPrice.toLocaleString()} F
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
