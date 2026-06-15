import React, { useState } from "react";
import { X, Trash2, Smartphone, Send, SendHorizontal, AlertCircle, Sparkles } from "lucide-react";
import { OrderItem } from "../types";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, color: string, storage: string, delta: number) => void;
  onRemoveItem: (productId: string, color: string, storage: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (customerData: { name: string; phone: string; address: string }) => Promise<void>;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}: CartModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const totalFCFA = cartItems.reduce((sum, item) => sum + item.priceFCFA * item.quantity, 0);
  const totalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (cartItems.length === 0) {
      setValidationError("Votre panier est vide.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError("Veuillez renseigner votre nom et votre numéro de téléphone.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Log order to internal persistence DB first
      await onPlaceOrder({
        name: customerName,
        phone: customerPhone,
        address: customerAddress || "Pointe-Noire, Congo",
      });

      // 2. Formulate gorgeous WhatsApp Message text
      let itemLines = "";
      cartItems.forEach((item, index) => {
        itemLines += `📱 *[Item ${index + 1}]* ${item.productName}\n`;
        itemLines += `   - Finition : ${item.color}\n`;
        itemLines += `   - Capacité : ${item.storage}\n`;
        itemLines += `   - Quantité : ${item.quantity}\n`;
        itemLines += `   - Prix Unitaire : ${item.priceFCFA.toLocaleString("fr-FR")} FCFA ($${item.priceUSD})\n`;
        itemLines += `   - Total Ligne : ${(item.priceFCFA * item.quantity).toLocaleString("fr-FR")} FCFA\n\n`;
      });

      const customerContactInfo = 
`👤 *COORDONNÉES CLIENT :*
- Nom complet : ${customerName}
- Téléphone de contact : ${customerPhone}
- Adresse de livraison : ${customerAddress || "Pointe-Noire, République du Congo"}\n`;

      const generatedMessage = 
`Bonjour Alpha+ Store 🇨🇬 ! Je souhaite valider la commande suivante :

${itemLines}💵 *MONTANT TOTAL DE LA COMMANDE :*
👉 *${totalFCFA.toLocaleString("fr-FR")} FCFA* (équivalent approximatif : $${totalUSD} USD)

${customerContactInfo}
Je souhaite être contacté au plus vite pour confirmer la livraison à mon adresse. Merci d'avance !`;

      const encodedText = encodeURIComponent(generatedMessage);
      // Strictly target specified business number: +242 06 950 57 65
      const cleanedPhone = "242069505765";
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;

      // Open in a secure external tab
      window.open(whatsappUrl, "_blank");

      // Reset and close
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      onClearCart();
      onClose();
    } catch (err) {
      setValidationError("Une erreur est survenue lors de la validation. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div 
        className="bg-white text-zinc-900 w-full max-w-lg h-full flex flex-col shadow-2xl relative animate-slide-left border-l border-zinc-200"
        id="cart-panel-container"
      >
        
        {/* Header toolbar */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-950 text-white">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-brand-blue" />
            <h3 className="text-base font-extrabold tracking-tight">Votre Panier d'Achat</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-transform hover:scale-105"
            id="cart-close-button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content body layout */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-full text-zinc-300">
                <Smartphone className="h-10 w-10" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-700">Votre panier est encore vide !</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Parcourez notre catalogue et ajoutez les derniers modèles d'iPhone 16 Pro et iPhone 17 Pro.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 text-xs bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full shadow"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Articles ajoutés
                </span>
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-zinc-400 hover:text-red-500 underline font-medium"
                >
                  Vider tout le panier
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden shadow-xs bg-white">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.storage}`} className="p-4 flex gap-3 text-sm">
                    {/* Simulated small color preview badge */}
                    <div className="w-12 h-16 rounded-xl bg-zinc-950 flex flex-col justify-between p-1 border shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{
                        backgroundColor: item.color.includes("Minuit") || item.color.includes("Noir") ? "#171717" :
                                         item.color.includes("Blanc") || item.color.includes("Saphir") ? "#e2e8f0" :
                                         item.color.includes("Naturel") || item.color.includes("Gris") ? "#a8a29e" :
                                         item.color.includes("Bleu") ? "#2563eb" :
                                         item.color.includes("Sable") || item.color.includes("Or") ? "#ca8a04" :
                                         item.color.includes("Rose") ? "#f43f5e" : "#3b82f6"
                      }} />
                      <span className="text-[7px] text-white/50 text-center uppercase font-mono">{item.storage.replace(" ", "")}</span>
                    </div>

                    {/* Meta info columns */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-extrabold text-zinc-900 truncate leading-tight">{item.productName}</h4>
                      <p className="text-[11px] text-zinc-500">{item.color} • {item.storage}</p>
                      <p className="text-xs font-black text-brand-blue font-mono mt-1">
                        {(item.priceFCFA * item.quantity).toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>

                    {/* Actions and inputs */}
                    <div className="flex flex-col justify-between items-end shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.productId, item.color, item.storage)}
                        className="p-1 hover:bg-rose-50 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-center space-x-2 bg-zinc-50 border border-zinc-150 p-1.5 rounded-xl">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.color, item.storage, -1)}
                          className="w-5 h-5 rounded-md bg-white border font-bold text-zinc-600 flex items-center justify-center hover:bg-zinc-100 text-xs shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold w-3 text-center text-zinc-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.color, item.storage, 1)}
                          className="w-5 h-5 rounded-md bg-white border font-bold text-zinc-600 flex items-center justify-center hover:bg-zinc-100 text-xs shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {cartItems.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3 text-xs text-zinc-700">
              <Sparkles className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-brand-blue">Livraison prioritaire à Pointe-Noire</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Vos articles sont préparés au magasin central face au Grand Hôtel. Livraison gratuite en centre-ville.</p>
              </div>
            </div>
          )}

          {/* Form Checkout container */}
          {cartItems.length > 0 && (
            <form onSubmit={handleCheckoutSubmit} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-150 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  Coordonnées de Livraison
                </h4>
                <p className="text-[10px] text-zinc-400 mb-2">Configurez vos détails pour valider l'achat sur WhatsApp.</p>
              </div>

              {validationError && (
                <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3 rounded-xl text-xs flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-semibold">{validationError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean-Marie Boungou"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Numéro de Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +242 06 950 57 65"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase block mb-1">Adresse de Livraison à Pointe-Noire</label>
                  <input
                    type="text"
                    placeholder="Ex: Centre-ville, face rond-point Lumumba"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Summary prices block */}
              <div className="pt-3 border-t border-zinc-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Sous-total :</span>
                  <span className="text-zinc-700 font-mono font-bold">{totalFCFA.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Livraison :</span>
                  <span className="text-emerald-600 font-semibold uppercase">Gratuite</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-dashed border-zinc-200 mt-2 pt-2 text-zinc-900">
                  <span className="text-sm font-black">Montant Total :</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-brand-blue block font-mono">
                      {totalFCFA.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      (Approx : ${totalUSD.toLocaleString()} USD)
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Trigger button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl flex items-center justify-center space-x-2 shadow-md transition-colors disabled:opacity-50"
              >
                <SendHorizontal className="h-4.5 w-4.5" />
                <span>{submitting ? "Validation..." : "Commander via WhatsApp"}</span>
              </button>

              <p className="text-[9px] text-zinc-400 text-center leading-relaxed">
                * En cliquant, un message structuré de votre commande sera généré et envoyé à notre agence commerciale centralisée basée à Pointe-Noire.
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
