import React from 'react';
import { Activity, Flame, Utensils, ScanLine } from 'lucide-react';

const SamplePreview: React.FC = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background decoration for this section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-white/0 via-white/50 to-white/0 pointer-events-none -z-10"></div>

      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">See It In Action</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">From a simple photo to a complete nutritional profile in seconds.</p>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 perspective-1000">
        <div className="bg-white rounded-[2.5rem] p-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)] transition-all duration-700 transform hover:-translate-y-2">
            
            <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 opacity-50 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-stretch relative z-10">
                {/* Image Section */}
                <div className="w-full lg:w-2/5 relative min-h-[300px] lg:min-h-0">
                    <img 
                        src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" 
                        alt="Butter Chicken" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                         <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit mb-2">
                            <ScanLine className="w-4 h-4" />
                            Scanning Complete
                         </div>
                         <h3 className="text-3xl font-bold text-white">Butter Chicken & Naan</h3>
                    </div>
                </div>

                {/* Data Section */}
                <div className="w-full lg:w-3/5 p-8 md:p-12 space-y-8 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div>
                             <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Portion</span>
                             <div className="text-slate-800 font-bold text-lg">1 Bowl (350g) + 1 Naan</div>
                        </div>
                        <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase border border-amber-200">Non-Veg</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                        <div className="bg-orange-50 p-5 rounded-3xl text-center border border-orange-100 shadow-sm transition-transform hover:scale-105 duration-300">
                            <div className="text-orange-950 font-black text-2xl md:text-3xl mb-1">485</div>
                            <div className="text-orange-600 text-xs font-bold uppercase tracking-wide">Calories</div>
                        </div>
                        <div className="bg-blue-50 p-5 rounded-3xl text-center border border-blue-100 shadow-sm transition-transform hover:scale-105 duration-300 delay-75">
                            <div className="text-blue-950 font-black text-2xl md:text-3xl mb-1">28g</div>
                            <div className="text-blue-600 text-xs font-bold uppercase tracking-wide">Protein</div>
                        </div>
                        <div className="bg-emerald-50 p-5 rounded-3xl text-center border border-emerald-100 shadow-sm transition-transform hover:scale-105 duration-300 delay-150">
                            <div className="text-emerald-950 font-black text-2xl md:text-3xl mb-1">6.5</div>
                            <div className="text-emerald-600 text-xs font-bold uppercase tracking-wide">Score</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-green-600 border border-slate-100 shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 block mb-1">AI Nutritionist Tip</span> 
                            <span className="text-slate-600 text-sm leading-relaxed">High in saturated fats. Consider swapping Butter Naan for <strong>Tandoori Roti</strong> to reduce calorie intake by ~120kcal.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePreview;