import React from 'react';
import { ScanEye, ChartPie, ScrollText, HeartPulse } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ScanEye className="w-7 h-7 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      title: "AI Food Recognition",
      description: "Advanced computer vision specifically trained on 500+ Indian regional cuisines from North to South."
    },
    {
      icon: <ChartPie className="w-7 h-7 text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      title: "Smart Macro Breakdown",
      description: "Get accurate estimates of Protein, Carbs, Fats, and Fiber per serving size instantly."
    },
    {
      icon: <ScrollText className="w-7 h-7 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      title: "Ingredient Detection",
      description: "Identifies hidden ingredients, allergens (like nuts or gluten), and spices used in preparation."
    },
    {
      icon: <HeartPulse className="w-7 h-7 text-rose-600" />,
      bg: "bg-rose-50",
      border: "border-rose-100",
      title: "Health & Diet Rating",
      description: "Receive a 1-10 health score with personalized actionable tips to make your meal healthier."
    }
  ];

  return (
    <div className="py-24 md:py-32 relative bg-white/40">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-3 block">Why Choose NutriScan?</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Powerful Features for Healthy Eating</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">Everything you need to track your nutrition without the hassle of manual logging.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-[2rem] border ${feature.border} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 group flex flex-col items-start h-full`}
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;