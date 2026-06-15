import React, { useState } from "react";
import { Plus, Trash2, ShieldCheck, Milestone, RefreshCw, Layers, Smartphone } from "lucide-react";
import { Product, getProductImage } from "../types";

interface ComparatorProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
}

export default function Comparator({ products, onOpenProduct }: ComparatorProps) {
  // Let user pick up to 3 models to compare. Defaults to iPhone 16 Pro and iPhone 15 Pro
  const [selectedIds, setSelectedIds] = useState<string[]>([
    products[7]?.id || products[0]?.id || "", // iPhone 16 Pro default primary
    products[5]?.id || products[1]?.id || "", // iPhone 15 Pro default secondary
  ].filter(Boolean));

  const addModel = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) {
      // replace last element or ignore
      setSelectedIds([...selectedIds.slice(0, 2), id]);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeSlot = (index: number) => {
    const updated = selectedIds.filter((_, i) => i !== index);
    setSelectedIds(updated);
  };

  const swapModel = (index: number, newId: string) => {
    if (newId === "") {
      removeSlot(index);
      return;
    }
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  // Resolve matching product records
  const comparedProducts = selectedIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Available candidate list (excluding those already selected)
  const availableToAdd = products.filter(p => !selectedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="comparator-page">
      
      {/* Page Title header */}
      <div className="text-left border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Comparateur d'iPhone Alpha+</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Comparez les caractéristiques techniques détaillées de nos iPhones pour choisir celui qui correspond parfaitement à vos besoins à Pointe-Noire (Congo).
        </p>
      </div>

      {/* Slots Controller bar */}
      <div className="bg-zinc-950 p-5 rounded-3xl text-white border border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Layers className="h-5 w-5 text-brand-blue" />
          <div>
            <h3 className="text-sm font-extrabold text-white">Sélectionnez les modèles ({comparedProducts.length}/3)</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Comparez jusqu'à 3 modèles simultanément côte à côte.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableToAdd.length > 0 && comparedProducts.length < 3 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addModel(e.target.value);
                  e.target.value = ""; // clear after add
                }
              }}
              className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl border-none outline-none cursor-pointer"
            >
              <option value="">➕ Ajouter un iPhone...</option>
              {availableToAdd.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <Smartphone className="h-10 w-10 text-zinc-300 mx-auto" />
          <div>
            <p className="text-sm font-extrabold text-zinc-700">Aucun iPhone en comparaison</p>
            <p className="text-xs text-zinc-400 mt-1">Utilisez le menu ci-dessus pour ajouter des téléphones à la grille de comparaison technique.</p>
          </div>
          <button 
            onClick={() => setSelectedIds([products[7]?.id || "", products[5]?.id || ""].filter(Boolean))}
            className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full"
          >
            Comparer les modèles récents (iPhone 16 Pro vs 15 Pro)
          </button>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-x-auto min-w-full">
          <table className="min-w-full table-fixed divide-y divide-zinc-200 text-xs">
            
            {/* Headers row with clean phone labels and drop controllers */}
            <thead>
              <tr className="bg-zinc-50">
                <th className="p-4 md:p-6 w-1/4 text-left text-zinc-500 font-extrabold uppercase tracking-wider">
                  Modèles d'iPhone
                </th>
                
                {comparedProducts.map((prod, idx) => (
                  <th key={prod.id} className="p-4 md:p-6 text-center align-top relative border-l border-zinc-150">
                    
                    {/* Delete Slot button */}
                    <button
                      onClick={() => removeSlot(idx)}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                      title="Retirer ce modèle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-3">
                      <span className="text-[10px] text-zinc-400 font-mono block uppercase">{prod.series}</span>
                      
                      {/* Model swap select menu dropdown */}
                      <select
                        value={prod.id}
                        onChange={(e) => swapModel(idx, e.target.value)}
                        className="mx-auto block text-center bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 font-bold text-zinc-900 outline-none focus:border-brand-blue"
                      >
                        {products.map(p => (
                          <option 
                            key={p.id} 
                            value={p.id}
                            disabled={selectedIds.includes(p.id) && p.id !== prod.id}
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <div className="w-16 aspect-[3/4] rounded-xl mx-auto border border-zinc-200 bg-zinc-950 overflow-hidden relative shadow-sm group">
                        <img
                          src={getProductImage(prod.id)}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <button
                        onClick={() => onOpenProduct(prod)}
                        className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-1.5 px-3 rounded-full text-[10px]"
                      >
                        Acheter ce modèle
                      </button>
                    </div>

                  </th>
                ))}

              </tr>
            </thead>

            {/* Technical Specifications Rows matrices */}
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              
              {/* Screen row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  📐 Écran / Affichage
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-medium">
                    {p.screen}
                  </td>
                ))}
              </tr>

              {/* Processor SOC chip row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  ⚙️ Processeur / Puce
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-medium">
                    {p.processor}
                  </td>
                ))}
              </tr>

              {/* RAM row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  ⚡ Mémoire Vive (RAM)
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-bold">
                    {p.ram}
                  </td>
                ))}
              </tr>

              {/* Storage options row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  💾 Capacités de stockage
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-semibold">
                    {p.storage.join(" • ")}
                  </td>
                ))}
              </tr>

              {/* Battery cell row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  🔋 Batterie / Alimentation
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-medium">
                    {p.battery}
                  </td>
                ))}
              </tr>

              {/* Camera modules row */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  📸 Appareil Photo / Objectifs
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150 font-medium">
                    {p.camera}
                  </td>
                ))}
              </tr>

              {/* Finishes color selection */}
              <tr className="hover:bg-zinc-50/50">
                <td className="p-4 md:p-5 font-extrabold text-zinc-900 text-xs">
                  🎨 Finitions disponibles
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 md:p-5 text-center text-zinc-700 leading-normal border-l border-zinc-150">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {p.colors.map((c, i) => (
                        <span key={i} className="inline-block bg-zinc-100 text-zinc-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Pricing comparison row */}
              <tr className="bg-blue-50/30">
                <td className="p-4 md:p-6 font-extrabold text-zinc-900 text-sm">
                  💰 Prix de référence
                </td>
                {comparedProducts.map((p) => {
                  const activePrice = p.isPromo && p.promoPriceFCFA ? p.promoPriceFCFA : p.priceFCFA;
                  return (
                    <td key={p.id} className="p-4 md:p-6 text-center border-l border-zinc-150">
                      <div className="font-mono text-base font-black text-brand-blue">
                        {activePrice.toLocaleString()} FCFA
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        Approx: ${p.isPromo && p.promoPriceUSD ? p.promoPriceUSD : p.priceUSD} USD
                      </div>
                      {p.isPromo && (
                        <span className="inline-block bg-rose-100 text-rose-600 font-extrabold text-[9px] px-2 py-0.5 rounded-md mt-2 uppercase tracking-wide">
                          Promo Active
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}
