import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: "Priya Mehta",
      role: "Fitness Enthusiast",
      text: "Finally an app that understands Indian cooking! It actually knows the difference between Pulao and Biryani. The macro breakdown is a lifesaver.",
      stars: 5,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      text: "I use this every day for my lunch. The health rating helps me make better choices at the office canteen. Super fast and accurate.",
      stars: 5,
      color: "bg-orange-100 text-orange-600"
    },
    {
      name: "Ananya Das",
      role: "Home Chef",
      text: "Love the ingredient detection feature. Helps me spot hidden calories in restaurant food. Highly recommended for anyone tracking their diet.",
      stars: 4,
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="py-16 md:py-24 relative">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
       </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white hover:border-orange-100 hover:shadow-[0_20px_50px_-15px_rgba(249,115,22,0.1)] transition-all duration-300 group flex flex-col relative">
                    <div className="absolute top-8 right-8 text-slate-100 group-hover:text-orange-100 transition-colors">
                        <Quote className="w-12 h-12 fill-current" />
                    </div>
                    
                    <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, index) => (
                            <Star 
                                key={index} 
                                className={`w-4 h-4 ${index < review.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                            />
                        ))}
                    </div>
                    
                    <p className="text-slate-700 font-medium leading-relaxed mb-8 relative z-10">"{review.text}"</p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                        <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center font-bold text-lg shadow-sm`}>
                            {review.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-base">{review.name}</div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wide">{review.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;