import React from 'react';
import { Sparkles, ChefHat, Zap, CheckCircle2, ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-center pt-24 pb-16 md:pt-32 md:pb-24 space-y-8 relative max-w-5xl mx-auto px-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute top-10 right-10 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-4000"></div>
      </div>

      <div className="inline-flex items-center justify-center p-1.5 pr-4 pl-2 bg-white/60 rounded-full mb-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] border border-white/60 backdrop-blur-md animate-fade-in-up hover:scale-105 transition-transform cursor-default">
         <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full mr-2 border border-orange-200">New</span>
         <span className="text-sm font-semibold text-slate-600 tracking-tight">
            Advanced AI model for Indian Curries
         </span>
      </div>
      
      <div className="relative inline-block animate-fade-in-up delay-100 z-10">
         <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] drop-shadow-sm">
            Smart Nutrition for <br />
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600">Indian Cuisine</span>
              <svg className="absolute -bottom-2 w-full h-3 text-orange-200/60 -z-10 left-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
         </h1>
      </div>

      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4 opacity-0 animate-fade-in-up delay-200 font-medium leading-relaxed">
        Upload a photo of your meal and get an instant breakdown of <span className="text-slate-900 font-semibold">Calories</span>, <span className="text-slate-900 font-semibold">Macros</span>, and <span className="text-slate-900 font-semibold">Ingredients</span>.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 opacity-0 animate-fade-in-up delay-300">
         <button 
           onClick={scrollToUpload}
           className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
         >
           Upload Photo
           <ArrowDown className="w-4 h-4" />
         </button>
         <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95">
           View Sample
         </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto mt-8 opacity-0 animate-fade-in-up delay-500">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
           <CheckCircle2 className="w-5 h-5 text-green-500" />
           <span>98% Accuracy</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
           <Zap className="w-5 h-5 text-amber-500" />
           <span>Instant Analysis</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
           <ChefHat className="w-5 h-5 text-orange-500" />
           <span>Dietitian Approved</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;