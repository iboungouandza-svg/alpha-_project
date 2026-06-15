import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Demande d'information",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate API form dispatch
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "Demande d'information", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in" id="contact-page">
      
      {/* Page header */}
      <div className="text-left border-b border-zinc-200 pb-5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Contactez Alpha+</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Une équipe dédiée pour vous accueillir en boutique ou répondre à toutes vos inquiries d'achat ou de service après-vente à Pointe-Noire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact details information & Showroom locations (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-zinc-950 text-white p-6 md:p-8 rounded-3xl border border-zinc-900 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-blue tracking-widest block">Notre Siège Central</span>
              <h2 className="text-xl font-bold mt-1">Boutique Pointe-Noire</h2>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-blue mr-3 shrink-0 mt-0.5" />
                <div className="space-y-1 text-zinc-200">
                  <p className="font-bold">Emplacement Physique :</p>
                  <p className="text-zinc-400">
                    Avenue Charles de Gaulle,<br />
                    Face au Grand Hôtel de Pointe-Noire,<br />
                    République du Congo
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-brand-blue mr-3 shrink-0 mt-0.5" />
                <div className="space-y-1 text-zinc-200">
                  <p className="font-bold">Téléphone & WhatsApp :</p>
                  <p className="text-zinc-400 font-mono">+242 06 950 57 65</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-brand-blue mr-3 shrink-0 mt-0.5" />
                <div className="space-y-1 text-zinc-200">
                  <p className="font-bold">Courriel électronique :</p>
                  <p className="text-zinc-400 font-mono">contact@alphapluscongo.com</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-zinc-900/60 text-xs">
              <p className="text-zinc-400 leading-normal">
                🕒 <span className="font-bold text-white">Heures d'ouverture :</span><br />
                Lundi au Samedi : 08h30 - 19h00<br />
                Dimanche : Fermé (Uniquement sur pré-commande)
              </p>
            </div>
          </div>

          {/* Quick Chat WhatsApp box */}
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-800">
              <MessageSquare className="h-5 w-5 text-emerald-600 shrink-0" />
              <h3 className="text-sm font-extrabold uppercase">Discussion Instantanée</h3>
            </div>
            
            <p className="text-xs text-emerald-700 leading-relaxed">
              Vous avez besoin d'une réponse immédiate sur la disponibilité d'une couleur d'iPhone 16 Pro ? Discutez en direct avec notre manager commercial.
            </p>

            <a
              href="https://wa.me/242069505765"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow transition-colors"
            >
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>

        </div>


        {/* Right Side: Form and Schematic Location Vector Map (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Schematic visual map vector placeholder (High accuracy representation of Grand Hôtel region) */}
          <div className="bg-white border p-4 rounded-3xl space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
              Carte de Localisation Schematic
            </h3>
            
            <div className="bg-slate-900 h-56 rounded-2xl relative overflow-hidden flex flex-col justify-center border p-4 text-white">
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-35" />
              
              {/* Layout Roadways */}
              <div className="absolute bg-zinc-800 h-8 left-0 right-0 top-1/2 -mt-4 flex items-center justify-around text-zinc-600 text-[10px] font-mono tracking-widest uppercase">
                <span>◀ Avenue Charles de Gaulle ▶</span>
              </div>
              <div className="absolute bg-zinc-800 w-12 top-0 bottom-0 left-1/3 -ml-6" />

              {/* Landmark 1: Grand Hôtel */}
              <div className="absolute top-8 left-8 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-center shadow-md">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">Face-à-face</span>
                <span className="text-xs font-black text-zinc-300">🏢 Grand Hôtel de Pointe-Noire</span>
              </div>

              {/* Center Shop Point Alpha+ */}
              <div className="absolute bottom-6 right-12 bg-brand-blue border-2 border-white p-3 rounded-2xl text-center shadow-xl animate-bounce">
                <span className="text-[10px] text-blue-100 block uppercase font-bold tracking-widest">Vous êtes ici !</span>
                <span className="text-sm font-extrabold text-white"> Boutique Alpha+</span>
              </div>

              {/* Coordinates indicators */}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2.5 py-1 rounded text-[8px] font-mono text-zinc-400 z-10 select-none">
                📍 Lat: -4.7978, Long: 11.8596
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 pl-1">
              * Notre boutique est idéalement située en plein cœur commercial de Pointe-Noire, facilitant l'accès sécurisé et le parking pour notre clientèle d'élite.
            </p>
          </div>

          {/* Form container */}
          <form onSubmit={handleSubmit} className="bg-white border rounded-3xl p-6 md:p-8 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Envoyer un message électronique</h3>
              <p className="text-xs text-zinc-400">Écrivez à notre direction générale pour recevoir un devis officiel (Proforma) ou un partenariat de flotte d'entreprise.</p>
            </div>

            {success && (
              <div className="bg-blue-50 text-blue-600 border border-blue-100 p-4 rounded-xl text-xs flex items-start space-x-2.5 animate-fade-in">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">Formulaire envoyé avec succès !</p>
                  <p className="text-zinc-500 mt-0.5">Notre service client s'engage à vous répondre par e-mail sous un délai maximum de 6h ouvrées.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block">Votre Nom كامل *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Guy-Florent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block">Adresse E-mail *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex : guyflorent@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-800 outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block">Sujet de contact</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-3 text-xs text-zinc-700 outline-none focus:border-brand-blue"
              >
                <option value="Demande d'information">Acheter ou tester un iPhone</option>
                <option value="Précommande iPhone 17">Faire une précommande prioritaire d'iPhone 17 / 17 Pro</option>
                <option value="Service Après Vente">Remplacement de batterie / Écran (SAV)</option>
                <option value="Partenariat Flotte">Demande de devis Proforma de flotte pro</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide block">Votre message *</label>
              <textarea
                required
                placeholder="Rédigez votre demande ici en détails..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-800 outline-none focus:border-brand-blue resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center space-x-2 text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? "Transmission..." : "Envoyer mon message"}</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
