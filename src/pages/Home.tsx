import React, { useState } from "react";
import { 
  ArrowRight, 
  Smartphone, 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowUpRight, 
  Shield, 
  Award, 
  HelpCircle, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Info,
  ChevronRight,
  Share2
} from "lucide-react";
import { Product, getProductImage } from "../types";

interface HomeProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Home({ products, onOpenProduct, setCurrentTab }: HomeProps) {
  const [videoError, setVideoError] = useState(false);
  
  // Extract and sort the 5 specific marked iPhones from the styles sheet in the precise order
  const targetIds = ["iphone-17-pro", "iphone-16-pro", "iphone-15-pro", "iphone-14-pro", "iphone-13"];
  
  const markedIphones = targetIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Remaining list for the general highlight catalog banner carousel
  const otherModels = products.filter(p => !targetIds.includes(p.id));

  const testimonials = [
    { 
      name: "Alphonse Mbaloula", 
      role: "Entrepreneur, Pointe-Noire", 
      comment: "J'ai acheté l'iPhone 16 Pro en finition Titane Sable chez Alpha+. Service ultra-premium, ils m'ont livré au bureau en moins de 45 minutes avec un agent sécurisé. Le téléphone est scellé d'origine. Merveilleux service client.", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    { 
      name: "Grace Tchicaya", 
      role: "Consultante Senior, Centre-ville", 
      comment: "L'iPhone 15 Pro de chez Alpha+ est impeccable. Le double affichage des prix en FCFA stables et USD m'a permis de régler en Mobile Money sans tracas. Leur support m'a assistée pour transférer toutes mes photos iCloud.", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    { 
      name: "Dimitri Ngoulou", 
      role: "Responsable Logistique, Côte Sauvage", 
      comment: "Je cherchais un fournisseur sérieux pour précommander l'iPhone 17 Pro de 12 Go de RAM. L'équipe d'Alpha+ à Pointe-Noire a géré la réservation avec un contrat clair. Entreprise ultra professionnelle et réactive.", 
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    }
  ];

  const faqs = [
    { 
      q: "Les iPhones vendus chez Alpha+ sont-ils certifiés neufs et originaux ?", 
      a: "Absolument. Alpha+ garantit à 100% l'authenticité de tous ses smartphones. Nos appareils proviennent exclusivement de circuits d'approvisionnement Apple officiels d'Europe et des États-Unis. Ils sont livrés scellés dans leur boîte d'origine avec garantie d'usine d'un an." 
    },
    { 
      q: "Comment fonctionne la livraison gratuite sécurisée à Pointe-Noire ?", 
      a: "Nous assurons une livraison premium gratuite sous escorte sécurisée dans tous les secteurs de Pointe-Noire : Centre-ville, Côte Sauvage, Nanga, Och, Mbota, Loandjili et Mpaka. Le livreur attend que vous ouvriez et inspectiez l'appareil avant de finaliser la transaction." 
    },
    { 
      q: "Quels sont les modes de paiement acceptés pour les iPhones ?", 
      a: "Pour votre commodité, nous acceptons le paiement en Francs CFA (XAF/FCFA) ou en Dollars US (USD). Vous pouvez régler par virement bancaire, chèque certifié, espèces à la livraison, ou directement via Mobile Money (MTN MoMo & Airtel Money)." 
    },
    { 
      q: "Puis-je échanger mon ancien iPhone avec le système Alpha Swap ?", 
      a: "Oui, tout à fait ! Nous offrons un service exclusif de reprise d'ancien iPhone (modèles 11 à 15). Après un diagnostic physique et logiciel rapide par nos experts à Pointe-Noire, nous déduisons sa valeur d'achat pour votre acquisition de votre nouveau modèle." 
    }
  ];

  // Helper to render approximate realistic CSS rendering of iPhones relative to series
  const renderIphoneCSS = (id: string, name: string) => {
    let frameColor = "bg-zinc-900";
    let isTripleCamera = true;
    let cameraDetail = "bg-zinc-800";
    let borderTheme = "border-zinc-800";
    let glowShadow = "shadow-zinc-900/50";

    if (id === "iphone-17-pro") {
      frameColor = "bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-900";
      cameraDetail = "bg-zinc-700/80";
      borderTheme = "border-zinc-700";
      glowShadow = "shadow-indigo-500/20";
    } else if (id === "iphone-16-pro") {
      frameColor = "bg-gradient-to-br from-[#c5a880]/30 via-stone-900 to-zinc-950"; // Desert Titanium
      cameraDetail = "bg-[#c5a880]/20";
      borderTheme = "border-[#c5a880]/40";
      glowShadow = "shadow-amber-500/10";
    } else if (id === "iphone-15-pro") {
      frameColor = "bg-gradient-to-br from-stone-800 via-stone-900 to-zinc-950"; // Natural Titanium
      cameraDetail = "bg-stone-700/65";
      borderTheme = "border-stone-600/35";
      glowShadow = "shadow-stone-400/10";
    } else if (id === "iphone-14-pro") {
      frameColor = "bg-gradient-to-br from-purple-950/40 via-zinc-900 to-black"; // Deep Purple
      cameraDetail = "bg-purple-900/30";
      borderTheme = "border-purple-800/40";
      glowShadow = "shadow-purple-500/10";
    } else if (id === "iphone-13") {
      frameColor = "bg-gradient-to-br from-blue-950/40 via-zinc-900 to-zinc-950";
      isTripleCamera = false;
      cameraDetail = "bg-blue-900/25";
      borderTheme = "border-blue-900/40";
      glowShadow = "shadow-blue-500/10";
    }

    return (
      <div className={`relative w-40 h-60 rounded-[2.5rem] p-3 border-4 ${borderTheme} ${frameColor} shadow-2xl ${glowShadow} flex flex-col justify-between my-auto transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2`}>
        {/* Dynamic Island or Notch top */}
        <div className="w-16 h-3.5 bg-black rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
          <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full mr-2"></span>
          <span className="w-3.5 h-1 bg-[#1e293b] rounded-full"></span>
        </div>

        {/* Back Camera structure Simulation inside the visual glass display */}
        <div className={`absolute top-10 left-3 w-14 h-14 rounded-2xl ${cameraDetail} p-1 flex flex-wrap gap-1 justify-center items-center shadow-lg`}>
          {isTripleCamera ? (
            <>
              <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-850"></span>
              </span>
              <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-850"></span>
              </span>
              <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-850"></span>
              </span>
            </>
          ) : (
            <>
              <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-850"></span>
              </span>
              <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-zinc-850"></span>
              </span>
            </>
          )}
        </div>

        {/* Dynamic series watermark glass label */}
        <div className="text-center w-full px-1">
          <p className="text-[10px] font-extrabold text-white/20 tracking-wider">ALPHA+ EXCLUSIVE</p>
          <p className="text-[13px] font-black text-white/90 drop-shadow select-none leading-none mt-1">{name}</p>
        </div>

        {/* Apple interactive design details */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-5 h-1 bg-white/20 rounded-full"></div>
          <p className="text-[8px] font-mono text-zinc-500">Apple Certification</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-20 bg-black text-white" id="home-page-container">
      
      {/* 1. HERO BANNER - Luxury Cinematic introduction */}
      <section className="relative min-h-[85vh] flex items-center bg-radial from-zinc-900 via-black to-black py-16 overflow-hidden border-b border-zinc-900" id="hero-banner">
        {/* Abstract glowing technology shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Copywriter Column (7 Cols on large wide screen) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-zinc-900/90 text-[#2563EB] border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl shadow-blue-950/25">
                <Sparkles className="h-4 w-4 mr-1 text-[#2563EB] animate-pulse" />
                <span>Distributeur Apple Agréé — Pointe-Noire, Congo</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] text-white">
                  Alpha<span className="text-[#2563EB]">+</span> <br />
                  <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">L'Élite de l'iPhone</span>
                </h1>
                
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                  Vivez l'expérience ultime du smartphone d'origine. Accédez en exclusivité aux dernières innovations d'Apple garanties 12 mois. Livraison sécurisée immédiate ou précommande exclusive à Pointe-Noire.
                </p>
              </div>

              {/* Action buttons with premium response */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setCurrentTab("catalog")}
                  className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:scale-102 shadow-lg shadow-blue-500/30 text-sm cursor-pointer"
                >
                  <span>Acheter un iPhone séléctionné</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setCurrentTab("compare")}
                  className="bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 font-bold py-4 px-7 rounded-2xl text-sm transition-all hover:border-zinc-650 flex items-center justify-center space-x-2"
                >
                  <span>Comparer les fiches techniques</span>
                </button>
              </div>

              {/* Real Local Metrics trust lines */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-900/80 text-xs text-zinc-500">
                <div className="space-y-1">
                  <span className="text-white font-extrabold block text-xl tracking-tight">100% Neufs</span>
                  <span>Scellés d'origine Apple</span>
                </div>
                <div className="space-y-1">
                  <span className="text-white font-extrabold block text-xl tracking-tight">SAV Local</span>
                  <span>Techniciens certifiés</span>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-white font-extrabold block text-xl tracking-tight">Livraison -1h</span>
                  <span>Pointe-Noire sécurisée</span>
                </div>
              </div>
            </div>

            {/* Premium Giant Hero 3D showcase render */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative group cursor-pointer w-full max-w-[360px]" onClick={() => {
                const headliner = products.find(p => p.id === "iphone-17-pro");
                if (headliner) onOpenProduct(headliner);
              }}>
                {/* Visual Glassmorphism announce card inspired by Apple store */}
                <div className="w-full rounded-[3rem] p-6 bg-zinc-950/80 border border-zinc-800 shadow-[0_0_80px_rgba(37,99,235,0.15)] flex flex-col justify-between h-[500px] relative transition-transform duration-700 hover:rotate-2 hover:scale-102">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                    <span className="bg-[#2563EB]/10 text-[#2563EB] border border-blue-900/50 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                      Révolution Technologique
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">12 Go RAM</span>
                  </div>

                  <div className="my-auto py-4 space-y-4 text-center">
                    <p className="text-xs uppercase text-zinc-500 font-extrabold tracking-widest leading-none">
                      Notre Joyau Futuriste
                    </p>
                    <h3 className="text-3xl font-black text-white hover:text-[#2563EB] transition-colors leading-tight">
                      iPhone 17 Pro
                    </h3>
                    
                    {/* Visual iPhone showcase high-definition video render inside the Hero */}
                    <div className="flex justify-center h-52 relative overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-inner shadow-blue-500/20">
                      {!videoError ? (
                        <video
                          src="/api/hero-video"
                          autoPlay
                          loop
                          muted
                          playsInline
                          onError={() => {
                            console.warn("Video failed to play, switching to premium image fallback");
                            setVideoError(true);
                          }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src="/src/assets/images/iphones_showcase_1781480409570.jpg"
                          alt="iPhone 17 Pro Showcase concept"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] border border-zinc-800">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-zinc-200 font-black uppercase font-mono tracking-wider text-[7px]">
                          {!videoError ? "CINÉMATIQUE" : "PREMIUM HD"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400">
                      Boîtier monocoque Titane-Aluminium poli & Caméra Périscopique Spatiale 10x
                    </p>
                  </div>

                  <div className="border-t border-zinc-900 pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Tarif exclusif</span>
                      <span className="text-sm font-black text-[#2563EB] font-mono">Dès 1.250.000 FCFA</span>
                    </div>
                    <span className="text-2xs bg-zinc-900 hover:bg-[#2563EB] text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition-all font-bold">
                      Précommander →
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SPECIFIC MARKED MODELS GRID SECTION (Premium Dark Slate Style matching image specs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" id="marked-iphones-row">
        
        {/* Section header following luxury standards */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#2563EB] font-black uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" />
            <span>Sélection Officielle Alpha+</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Les Modèles Phare d'Exception
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Trouvez l'iPhone qui correspond exactement à vos exigences. Chaque modèle est minutieusement certifié original et assorti de notre service d'assistance premium à Pointe-Noire.
          </p>
        </div>

        {/* BREATHTAKING DIRECT SELECTION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {markedIphones.map((prod) => {
            const displayRating = prod.ratingOverride || 4.5;
            const displayReviewsCount = prod.reviewsCountOverride || 15;
            const displayBadge = prod.badgeOverride || "PREMIUM";

            return (
              <div 
                key={prod.id}
                onClick={() => onOpenProduct(prod)}
                className="group bg-zinc-950/70 border border-zinc-850 hover:border-zinc-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative"
              >
                {/* Premium category top badge overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
                  <span className="bg-[#2563EB] text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest shadow-lg">
                    {displayBadge}
                  </span>
                </div>

                {/* Luxury generated product image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 border-b border-zinc-900 flex items-center justify-center">
                  <img
                    src={getProductImage(prod.id)}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Metadata alignment and Apple rating score stars */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Stars and feedback scoring as marked in reference image */}
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const isFullField = i < Math.floor(displayRating);
                          return (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${isFullField ? "fill-amber-500 text-amber-500" : "text-zinc-600"}`} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] font-extrabold text-zinc-300 font-mono pl-1">
                        {displayRating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        ({displayReviewsCount} avis)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-black tracking-widest text-[#2563EB] block">
                        Série {prod.series}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#2563EB] transition-colors leading-tight truncate">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing grid and buttons */}
                  <div className="pt-4 border-t border-zinc-900 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-zinc-500 uppercase block font-semibold">À Pointe-Noire (FCFA)</span>
                        <span className="text-sm font-black text-white font-mono block">
                          {prod.priceFCFA.toLocaleString("fr-FR")} F
                        </span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-[8px] text-zinc-500 uppercase block font-semibold">Devise US Dollar</span>
                        <span className="text-xs font-bold text-[#2563EB] font-mono block">
                          ${prod.priceUSD.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    {/* Simple detail button trigger with subtle design enhancement */}
                    <div className="w-full bg-zinc-900 border border-zinc-800 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] text-zinc-300 text-center text-xs font-black py-2.5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5">
                      <span>Détails & Achat</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Visual CTA to browse and filter more items from catalog */}
        <div className="text-center pt-4">
          <button 
            onClick={() => setCurrentTab("catalog")}
            className="inline-flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-400 px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-widest border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
          >
            <span>Afficher la gamme complète Alpha Swap</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </section>

      {/* 3. TRUST VALUES BANNER CUSTOMIZED TO REPUBLIC OF CONGO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl p-8 border border-zinc-800/60 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            
            <div className="flex items-start space-x-5 p-2 md:p-6 first:pl-0">
              <div className="bg-[#2563EB]/10 p-3.5 rounded-2xl text-[#2563EB] shrink-0 border border-blue-900/30">
                <Truck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Livraison Sécurisée</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Service express gratuit de livraison en mains propres à Pointe-Noire en moins d'une heure. Inspectez scrupuleusement l'iPhone d'origine avant de payer.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 pt-6 md:pt-2 md:p-6">
              <div className="bg-[#2563EB]/10 p-3.5 rounded-2xl text-[#2563EB] shrink-0 border border-blue-900/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Garantie d'Usine 1 An</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bénéficiez d'une garantie constructeur de 12 mois. En cas de défaut technique, notre service technique basé à Pointe-Noire prend tout en charge.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 pt-6 md:pt-2 md:p-6">
              <div className="bg-[#2563EB]/10 p-3.5 rounded-2xl text-[#2563EB] shrink-0 border border-blue-900/30">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Mobile Money & Devises</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Réglez sereinement en Francs CFA (XAF) ou Dollars USD. Nous prenons en charge les transactions MTN MoMo et Airtel Money sans aucun frais caché.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CHRONOS PRESENTATION ON LATEST RELEASES */}
      {otherModels.length > 0 && (
        <section className="bg-zinc-950 py-16 border-t border-b border-zinc-900/60" id="other-models-row">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
              <div className="space-y-1">
                <span className="text-xs text-[#2563EB] font-bold uppercase tracking-widest block">Éditions Standards & Plus</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Autres Modèles Disponibles</h2>
              </div>
              <button 
                onClick={() => setCurrentTab("catalog")}
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center mt-2 sm:mt-0 cursor-pointer"
              >
                <span>Explorer le catalogue complet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherModels.slice(0, 4).map((p) => (
                <div 
                  key={p.id}
                  onClick={() => onOpenProduct(p)}
                  className="bg-black/50 border border-zinc-900 rounded-3xl p-5 hover:border-zinc-800 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded-md font-mono">
                      Ref: {p.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-extrabold flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
                      En Stock
                    </span>
                  </div>

                  {/* Beautiful product thumbnail */}
                  <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center relative">
                    <img
                      src={getProductImage(p.id)}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>

                  <div className="mt-4 mb-6 space-y-1.5">
                    <h3 className="text-md font-bold text-white truncate">{p.name}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="border-t border-zinc-900/80 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase block font-semibold">Prix unique</span>
                      <span className="text-xs font-black text-[#2563EB] font-mono">
                        {p.priceFCFA.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <span className="text-[10px] bg-zinc-900 text-zinc-300 px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider group-hover:bg-[#2563EB]">
                      Acheter
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. THE ALPHA SWAP RECOVERY SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs text-[#2563EB] font-black uppercase tracking-widest block">Système d'Échange Alpha Swap</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Donnez de la Valeur à votre ancien iPhone
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ne laissez pas vos anciens smartphones dormir dans un tiroir. Alpha+ introduit à Pointe-Noire le programme de reprise le plus honnête et compétitif du marché congolais.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-950/40 p-2 rounded-xl text-emerald-400 shrink-0 border border-emerald-900/40">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Diagnostic technique gratuit en 15 minutes</h4>
                  <p className="text-xs text-zinc-400">Évaluation transparente de l'état de l'écran, de la batterie, et de l'authenticité de l'appareil.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-950/40 p-2 rounded-xl text-emerald-400 shrink-0 border border-emerald-900/40">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Déduction immédiate sur votre nouvel iPhone</h4>
                  <p className="text-xs text-zinc-400">La valeur d'évaluation est directement déduite du prix total en FCFA de votre nouvel achat.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-emerald-950/40 p-2 rounded-xl text-emerald-400 shrink-0 border border-emerald-900/40">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Transfert gratuit et sécurisé de vos données</h4>
                  <p className="text-xs text-zinc-400">Nos techniciens s'occupent de cloner votre historique, contacts et messages vers le nouvel appareil.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-zinc-900 pb-3 flex items-center justify-between">
              <span>Simulateur d'échange estimé</span>
              <span className="text-[10px] text-zinc-500">Pointe-Noire</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-black/60 rounded-xl border border-zinc-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Votre modèle actuel (en bon état)</span>
                  <span className="text-xs font-bold text-zinc-200">iPhone 14 Pro Max 256 Go</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">~ 380.000 FCFA</span>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-zinc-900 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Nouveau modèle visé</span>
                  <span className="text-xs font-bold text-zinc-200">iPhone 16 Pro 256 Go</span>
                </div>
                <span className="text-xs font-extrabold text-[#2563EB] font-mono">1.150.000 FCFA</span>
              </div>

              <div className="p-4 bg-emerald-950/15 rounded-xl border border-emerald-900/40 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-emerald-400/80 block">Reste à payer estimé</span>
                  <span className="text-sm font-black text-white">Avec offre de reprise Swap</span>
                </div>
                <span className="text-sm font-black text-emerald-400 font-mono">770.000 FCFA</span>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab("contact")}
              className="w-full bg-[#2563EB] text-white text-xs font-black py-3.5 rounded-xl transition-all hover:bg-blue-600 block text-center uppercase tracking-wider cursor-pointer"
            >
              Faire estimer mon iPhone par WhatsApp
            </button>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION - Pointe-Noire reviews */}
      <section className="bg-zinc-950/40 border-t border-b border-zinc-900 py-16" id="client-reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs text-[#2563EB] font-bold uppercase tracking-wider block">Retours sur expérience</span>
            <h2 className="text-3xl font-extrabold text-white">Ce que disent nos clients au Congo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-zinc-950/85 border border-zinc-900 p-6 rounded-3xl shadow-xs flex flex-col justify-between hover:border-zinc-800 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-900/80 flex items-center space-x-3">
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC ACCORDION FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6" id="faq-section">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs text-[#2563EB] font-bold uppercase tracking-wider block">Des questions ?</span>
          <h2 className="text-3xl font-extrabold text-white">Foire Aux Questions</h2>
        </div>

        <div className="divide-y divide-zinc-900 border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950/50 shadow-xs">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group p-5 outline-none cursor-pointer" id={`faq-${idx}`}>
              <summary className="flex items-center justify-between text-white font-bold text-xs sm:text-sm select-none list-none">
                <span className="flex items-center space-x-3">
                  <HelpCircle className="h-4.5 w-4.5 text-[#2563EB] shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <span className="transition duration-300 group-open:rotate-180 text-zinc-500 group-hover:text-white">
                  ▼
                </span>
              </summary>
              <p className="text-xs text-zinc-400 leading-relaxed mt-4 pl-7.5 border-t border-zinc-950 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION - Direct checkout or speak to sales team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-[#2563EB] text-white p-8 md:p-14 rounded-3xl shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-4 max-w-xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Acquérez votre iPhone d'exception aujourd'hui
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Sélectionnez les caractéristiques techniques de stockage et de couleur de votre choix dans notre catalogue, puis validez sur WhatsApp. Nous assurons la mise en route et le paramétrage gratuit à Pointe-Noire.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setCurrentTab("catalog")}
              className="bg-white hover:bg-zinc-100 text-[#2563EB] font-black py-4 px-8 rounded-2xl shadow-xl transition-all hover:scale-102 text-xs uppercase tracking-widest cursor-pointer"
            >
              Consulter le catalogue
            </button>

            <a
              href="https://wa.me/242069505765"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:scale-102 text-xs uppercase tracking-widest border border-emerald-500"
            >
              <MessageSquare className="h-4 w-4 mr-1 text-white" />
              <span>Contact direct WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
