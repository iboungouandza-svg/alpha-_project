import React, { useState, useMemo } from "react";
import { Search, FileText, Calendar, User, Clock, ArrowLeft, ChevronRight, Apple } from "lucide-react";
import { BlogArticle } from "../types";

interface BlogProps {
  articles: BlogArticle[];
}

export default function Blog({ articles }: BlogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  
  // Reading visual detailed view state
  const [readingArticle, setReadingArticle] = useState<BlogArticle | null>(null);

  const categories = ["Tous", "Actualités Apple", "Conseils", "Comparatifs", "Guides d'achat"];

  const processedArticles = useMemo(() => {
    let result = [...articles];

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.excerpt.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "Tous") {
      result = result.filter(a => a.category === selectedCategory);
    }

    return result;
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="blog-page">
      
      {readingArticle ? (
        /* EXPANDED FULL BLOG READING VIEW */
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" id="blog-article-reader">
          <button
            onClick={() => setReadingArticle(null)}
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-blue hover:underline bg-white p-2.5 px-4 rounded-xl border"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour aux articles</span>
          </button>

          {/* Full content layout */}
          <article className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
            
            {/* Header backdrop */}
            <div className="bg-zinc-950 p-8 md:p-12 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <span className="bg-brand-blue text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                  {readingArticle.category}
                </span>

                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  {readingArticle.title}
                </h1>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                  <span className="flex items-center space-x-1">
                    <User className="h-3.5 w-3.5" />
                    <span>Par {readingArticle.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{readingArticle.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Lumière de lecture: {readingArticle.readTime}</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Content narrative body */}
            <div className="p-6 md:p-10 text-sm md:text-base text-zinc-700 leading-relaxed space-y-4">
              <p className="font-extrabold text-zinc-900 border-l-4 border-brand-blue pl-4 text-sm sm:text-base italic bg-zinc-50 py-3.5 pr-2 rounded-r-xl">
                {readingArticle.excerpt}
              </p>

              {/* Format line breaks safely */}
              <div className="space-y-4 text-xs sm:text-sm pl-1">
                {readingArticle.content.split("\n\n").map((chunk, idx) => {
                  if (chunk.startsWith("###")) {
                    return (
                      <h3 key={idx} className="text-base font-extrabold text-zinc-900 pt-3">
                        {chunk.replace("###", "").trim()}
                      </h3>
                    );
                  }
                  if (chunk.startsWith("-") || chunk.startsWith("*")) {
                    return (
                      <ul key={idx} className="list-disc pl-6 space-y-2 py-1">
                        {chunk.split("\n").map((li, lIdx) => (
                          <li key={lIdx} className="text-zinc-700">
                            {li.replace(/^[\s-*]+/, "").trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  // Standard numerical lists helper
                  if (/^\d+\./.test(chunk)) {
                    return (
                      <ol key={idx} className="list-decimal pl-6 space-y-2 py-1">
                        {chunk.split("\n").map((li, lIdx) => (
                          <li key={lIdx} className="text-zinc-700">
                            {li.replace(/^\d+\.\s*/, "").trim()}
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {chunk}
                    </p>
                  );
                })}
              </div>
            </div>

          </article>
        </div>
      ) : (
        /* STANDARD BLOG ARTICLES LIST VIEW */
        <div className="space-y-8 animate-fade-in">
          
          {/* Header page titles */}
          <div className="text-left border-b border-zinc-200 pb-5">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Le Blog Tech d'Alpha+</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Suivez l'actualité d'Apple pour maîtriser vos appareils sous le climat de Pointe-Noire et Brazzaville.
            </p>
          </div>

          {/* Categories Tab Selector and Search bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-between">
            {/* Search Input bar */}
            <div className="relative md:col-span-1">
              <input
                type="text"
                placeholder="Chercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-xs rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-brand-blue text-zinc-800"
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>

            {/* Categories filters tabs list */}
            <div className="md:col-span-2 flex flex-wrap gap-2 md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-2xs sm:text-xs font-semibold transition-colors border ${
                    selectedCategory === cat
                      ? "bg-black hover:bg-zinc-850 text-white border-black"
                      : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Multi column lists */}
          {processedArticles.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-zinc-200">
              <FileText className="h-10 w-10 text-zinc-200 mx-auto" />
              <p className="text-sm font-bold text-zinc-700 mt-3">Aucun article ne correspond à votre recherche</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("Tous"); }}
                className="mt-2 text-xs text-brand-blue underline"
              >
                Vider les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processedArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => setReadingArticle(art)}
                  className="group bg-white border border-zinc-150 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="bg-zinc-950 p-6 text-white h-48 flex flex-col justify-between relative">
                    <div className="absolute inset-0 bg-brand-blue/10 pointer-events-none" />
                    
                    <span className="bg-brand-blue text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded自 w-fit">
                      {art.category}
                    </span>

                    <h3 className="text-sm sm:text-base font-extrabold line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
                      {art.title}
                    </h3>

                    <div className="flex items-center text-[10px] text-zinc-400 gap-2 border-t border-zinc-900 pt-2">
                      <Clock className="h-3 w-3 text-brand-blue" />
                      <span>{art.readTime} de lecture</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between text-xs font-bold text-zinc-900">
                      <span className="text-[10px] text-zinc-400 font-mono font-medium">{art.date}</span>
                      <span className="text-brand-blue group-hover:underline flex items-center">
                        <span>Lire l'article</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-0.5 shrink-0" />
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
