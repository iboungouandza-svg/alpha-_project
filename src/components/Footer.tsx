import React from "react";
import { Smartphone, Mail, Phone, MapPin, CheckCircle, Apple } from "lucide-react";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800" id="global-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentTab("home")}>
              <div className="bg-brand-blue p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Alpha<span className="text-brand-blue font-black">+</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              La destination de référence pour acquérir votre iPhone haut de gamme à Pointe-Noire (République du Congo). Authenticité garantie, service après-vente irréprochable et options de financement disponibles.
            </p>
            <div className="flex items-center space-x-2 text-xs bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>Garantie constructeur Apple 12 mois</span>
            </div>
          </div>

          {/* Catalog series selection */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center">
              <Apple className="h-4 w-4 mr-1 text-zinc-300" /> Notre Gamme
            </h3>
            <ul className="space-y-2 text-xs">
              {["iPhone 17 Pro", "iPhone 17", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 13 Pro"].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => setCurrentTab("catalog")} 
                    className="hover:text-white hover:underline transition-colors block text-left"
                  >
                    {item} disponible
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab("home")} className="hover:text-white transition-colors">
                  Accueil & Offres Spéciales
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("catalog")} className="hover:text-white transition-colors">
                  Catalogue & Filtres
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("compare")} className="hover:text-white transition-colors">
                  Comparateur technique
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("blog")} className="hover:text-white transition-colors">
                  Blog d'actualités Apple
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("contact")} className="hover:text-white transition-colors">
                  Contactez-nous & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
              Boutique Pointe-Noire
            </h3>
            <div className="space-y-3 text-xs leading-5">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-brand-blue mr-2 shrink-0 mt-0.5" />
                <span>
                  Avenue Charles de Gaulle,<br />
                  Face au Grand Hôtel de Pointe-Noire,<br />
                  République du Congo
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-brand-blue mr-2 shrink-0" />
                <span>+242 06 950 57 65</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-brand-blue mr-2 shrink-0" />
                <span>contact@alphapluscongo.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footnote */}
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          <p>© 2026 Alpha+. Tous droits réservés. Conçu pour honorer l'excellence technologique. Boutique d'iPhone Premium à Pointe-Noire, Congo.</p>
          <div className="mt-2 text-zinc-600 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] leading-relaxed">
            <span>Disclaimer: Apple et iPhone sont des marques déposées de Apple Inc. Alpha+ est un revendeur indépendant spécialisé.</span>
            <span className="hidden sm:inline text-zinc-800">|</span>
            <button
              onClick={() => setCurrentTab("admin")}
              className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Portail de gestion"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-850" />
              Espace Propriétaire
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
