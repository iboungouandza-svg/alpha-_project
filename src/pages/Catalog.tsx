import React, { useState, useMemo } from "react";
import { Search, Filter, RefreshCw, Smartphone, Key, Star, ArrowUpDown } from "lucide-react";
import { Product, getProductImage } from "../types";

interface CatalogProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
}

export default function Catalog({ products, onOpenProduct }: CatalogProps) {
  // Query Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("Tous");
  const [selectedStorage, setSelectedStorage] = useState<string>("Tous");
  const [selectedColor, setSelectedColor] = useState<string>("Tous");
  const [maxPriceFCFA, setMaxPriceFCFA] = useState<number>(1500000);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "pop">("pop");

  // Constant unique capacities, finishes, and series options derived from available assets
  const seriesOptions = useMemo(() => {
    const list = new Set(products.map(p => p.series));
    return ["Tous", ...Array.from(list)];
  }, [products]);

  const storageOptions = ["Tous", "128 Go", "256 Go", "512 Go", "1 To"];
  
  const colorCategories = ["Tous", "Titane", "Noir", "Blanc", "Bleu", "Or", "Rose"];

  // Perform multi-criteria queries on products array in memory
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search query
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.processor.toLowerCase().includes(query)
      );
    }

    // 2. Series Filtering
    if (selectedSeries !== "Tous") {
      result = result.filter(p => p.series === selectedSeries);
    }

    // 3. Storage capacity filter
    if (selectedStorage !== "Tous") {
      result = result.filter(p => p.storage.includes(selectedStorage));
    }

    // 4. Color filter matching
    if (selectedColor !== "Tous") {
      result = result.filter(p => 
        p.colors.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    // 5. Price bound upper constraint
    result = result.filter(p => {
      const activePrice = p.isPromo && p.promoPriceFCFA ? p.promoPriceFCFA : p.priceFCFA;
      return activePrice <= maxPriceFCFA;
    });

    // 6. Apply dynamic ordering arrays
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const ap = a.isPromo && a.promoPriceFCFA ? a.promoPriceFCFA : a.priceFCFA;
        const bp = b.isPromo && b.promoPriceFCFA ? b.promoPriceFCFA : b.priceFCFA;
        return ap - bp;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const ap = a.isPromo && a.promoPriceFCFA ? a.promoPriceFCFA : a.priceFCFA;
        const bp = b.isPromo && b.promoPriceFCFA ? b.promoPriceFCFA : b.priceFCFA;
        return bp - ap;
      });
    } else if (sortBy === "pop") {
      // Prioritize Featured, New releases, and high-rating counts
      result.sort((a, b) => {
        const scoreA = (a.isFeatured ? 5 : 0) + (a.isNew ? 3 : 0) + (a.reviews?.length || 0);
        const scoreB = (b.isFeatured ? 5 : 0) + (b.isNew ? 3 : 0) + (b.reviews?.length || 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [products, searchTerm, selectedSeries, selectedStorage, selectedColor, maxPriceFCFA, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedSeries("Tous");
    setSelectedStorage("Tous");
    setSelectedColor("Tous");
    setMaxPriceFCFA(1500000);
    setSortBy("pop");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="catalog-page">
      
      {/* Title Header text section */}
      <div className="text-left border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Catalogue iPhones</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Explorez et achetez nos iPhones d'origine authentique Apple garantis 1 an. {processedProducts.length} modèles correspondent à vos critères.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Search & Filter Controls Panel */}
        <aside className="space-y-6" id="catalog-sidebar">
          
          {/* Quick Clear Button */}
          <div className="flex items-center justify-between bg-zinc-950 p-4 text-white rounded-2xl border border-zinc-800">
            <div className="flex items-center space-x-2">
              <Filter className="h-4.5 w-4.5 text-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-wider">Filtres</span>
            </div>
            <button 
              onClick={resetAllFilters}
              className="text-[10px] text-zinc-400 hover:text-white flex items-center space-x-1 underline"
            >
              <RefreshCw className="h-3 w-3 animate-spin-reverse" />
              <span>Réinitialiser</span>
            </button>
          </div>

          {/* Search Inputs */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-150 space-y-2">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Recherche</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex : iPhone 16 Pro, Bionic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-150 text-xs rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-brand-blue text-zinc-800"
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Generation Series Filter */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-150 space-y-3">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Série iPhone</label>
            <div className="flex flex-col space-y-1">
              {seriesOptions.map((ser) => (
                <button
                  key={ser}
                  onClick={() => setSelectedSeries(ser)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    selectedSeries === ser
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {ser}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity storage Filter */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-150 space-y-3">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Stockage minimal</label>
            <div className="grid grid-cols-2 gap-2">
              {storageOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStorage(st)}
                  className={`px-2 py-2 rounded-xl text-2xs font-semibold border transition-all ${
                    selectedStorage === st
                      ? "bg-black text-white border-black"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Finish color category selector */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-150 space-y-3">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block">Finition dominant</label>
            <div className="flex flex-wrap gap-1.5">
              {colorCategories.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    selectedColor === col
                      ? "bg-brand-blue text-white font-extrabold"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Price upper bounds slider */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-150 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">Prix maximum</label>
              <span className="text-xs font-black text-brand-blue font-mono">
                {maxPriceFCFA.toLocaleString()} F
              </span>
            </div>
            <input
              type="range"
              min={400000}
              max={1500000}
              step={50000}
              value={maxPriceFCFA}
              onChange={(e) => setMaxPriceFCFA(Number(e.target.value))}
              className="w-full accent-brand-blue h-1.5 bg-zinc-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>400k F</span>
              <span>1.5M F</span>
            </div>
          </div>

        </aside>

        {/* Right Side: Grid of available iPhones with Sort Toolbars */}
        <main className="lg:col-span-3 space-y-6" id="catalog-products-showcase">
          
          {/* Sorting and result count header bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-150 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <div>
              Nous avons trouvé <span className="font-extrabold text-zinc-900">{processedProducts.length}</span> iPhones correspondants.
            </div>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="font-medium">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 font-bold text-zinc-800 outline-none focus:border-brand-blue"
              >
                <option value="pop">🔥 Popularité & Nouveautés</option>
                <option value="price-asc">💵 Prix : du - cher au + cher</option>
                <option value="price-desc">💵 Prix : du + cher au - cher</option>
                <option value="name">🔤 Alphabétique (Modèle)</option>
              </select>
            </div>
          </div>

          {/* Empty response placeholder view */}
          {processedProducts.length === 0 ? (
            <div className="bg-white border rounded-3xl p-16 text-center space-y-4">
              <Smartphone className="h-12 w-12 text-zinc-300 mx-auto" />
              <div>
                <p className="text-base font-extrabold text-zinc-700">Aucun iPhone ne correspond à vos critères</p>
                <p className="text-xs text-zinc-400 mt-1">Essayez d'ajuster vos filtres, d'augmenter le budget maximum, ou de réinitialiser la recherche.</p>
              </div>
              <button 
                onClick={resetAllFilters}
                className="bg-zinc-950 text-white font-bold py-2.5 px-6 rounded-full text-xs"
              >
                Tout réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedProducts.map((prod) => {
                const activePrice = prod.isPromo && prod.promoPriceFCFA ? prod.promoPriceFCFA : prod.priceFCFA;
                const ratingValue = prod.ratingOverride || 4.5;
                const reviewsCountValue = prod.reviewsCountOverride || 15;
                const badgeToUse = prod.badgeOverride || (prod.isNew ? "Nouveau" : prod.isPromo ? "Promo" : "Premium");

                return (
                  <div 
                    key={prod.id}
                    onClick={() => onOpenProduct(prod)}
                    className="group bg-white border border-zinc-150 rounded-3xl overflow-hidden hover:shadow-xl hover:border-zinc-300 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    
                    {/* Beautiful product image container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 flex flex-col justify-between p-4">
                      
                      {/* Top tags tags */}
                      <div className="flex justify-between items-start z-10 w-full">
                        <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                          {badgeToUse}
                        </span>

                        <span className="text-[10px] text-zinc-100 font-mono bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-800">
                          Stock: {prod.stock}
                        </span>
                      </div>

                      {/* Generated clean iPhone product image */}
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={getProductImage(prod.id)}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-all to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Metadata text details content */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      
                      <div className="space-y-1.5">
                        
                        {/* Rating stars inside the catalog card */}
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2.5 w-2.5 ${i < Math.floor(ratingValue) ? "fill-amber-500 text-amber-500" : "text-zinc-300"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-extrabold text-zinc-700 font-mono pl-0.5">
                            {ratingValue.toFixed(1)}
                          </span>
                          <span className="text-[9px] text-zinc-400">
                            ({reviewsCountValue} avis)
                          </span>
                        </div>

                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block font-mono">
                          {prod.series} • {prod.storage[0]}
                        </span>
                        <h3 className="text-sm font-extrabold text-zinc-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-2xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Display specs badges list */}
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-zinc-100 text-zinc-700 text-[9px] px-2 py-0.5 rounded-md font-medium font-mono">
                            {prod.screen.split(" ")[0]} 
                          </span>
                          <span className="bg-zinc-100 text-zinc-700 text-[9px] px-2 py-0.5 rounded-md font-medium font-mono">
                            {prod.ram}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-zinc-50 flex items-center justify-between">
                          <div>
                            <span className="text-[8px] text-zinc-400 uppercase block font-semibold">Tarif unitaire</span>
                            <span className="text-sm font-black text-[#2563EB] font-mono block">
                              {activePrice.toLocaleString("fr-FR")} FCFA
                            </span>
                          </div>
                          
                          <div className="bg-zinc-950 text-white text-[10px] font-extrabold px-3 py-2 rounded-xl group-hover:bg-[#2563EB] transition-colors uppercase tracking-wider">
                            Voir →
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
