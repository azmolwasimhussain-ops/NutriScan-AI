import React, { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToUpload = () => {
    const element = document.getElementById('upload-section');
    if (element) {
      const offset = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
            <ChefHat className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              NutriScan AI
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase hidden sm:block">
              Indian Cuisine Specialist
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={scrollToUpload}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            Try Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;