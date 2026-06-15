import React, { useState } from "react";
import { ShoppingBag, ArrowRightLeft, Menu, X, Smartphone, ShieldCheck } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
  isAdmin,
  onLogoutAdmin
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Accueil" },
    { id: "catalog", label: "Catalogue" },
    { id: "compare", label: "Comparateur" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" }
  ];

  const visibleMenuItems = isAdmin
    ? [...menuItems, { id: "admin", label: "Tableau de Bord" }]
    : menuItems;

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleTabClick("home")}
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="relative overflow-hidden w-9 h-9 rounded-xl border border-zinc-700 transition-transform duration-300 group-hover:scale-110">
              <img
                src="/src/assets/images/alpha_luxury_logo_1781480392637.jpg"
                alt="Alpha+ Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-brand-blue bg-clip-text text-transparent">
              Alpha<span className="text-[#2563EB] font-black">+</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav">
            {visibleMenuItems.map((item) => {
              // Hide private Admin dashboard tab unless they are actually logged in, 
              // or let them click to login. Showing it is user-friendly to access.
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-800 text-brand-blue shadow-inner"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions Block */}
          <div className="flex items-center space-x-3" id="header-actions">
            
            {/* Admin status tag */}
            {isAdmin && (
              <span className="hidden lg:flex items-center space-x-1 bg-emerald-950/85 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin Actif</span>
              </span>
            )}

            {/* Compare shortcut */}
            <button
              onClick={() => handleTabClick("compare")}
              className={`p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors relative ${
                currentTab === "compare" ? "text-brand-blue bg-zinc-900" : ""
              }`}
              title="Comparer les modèles d'iPhone"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-full bg-brand-blue/15 hover:bg-brand-blue text-zinc-200 hover:text-white transition-all duration-300 relative group"
              id="cart-trigger-button"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-blue border border-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Logout button (visible if admin is active on header) */}
            {isAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="hidden md:block text-xs bg-red-950/60 border border-red-900 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-full transition-colors"
              >
                Déconnexion
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 md:hidden transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Responsive Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-2 pt-2 pb-4 space-y-1 animate-fade-in" id="mobile-nav">
          {visibleMenuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => {
                onLogoutAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-950/20 transition-colors"
            >
              Déconnexion Admin
            </button>
          )}
        </div>
      )}
    </header>
  );
}
