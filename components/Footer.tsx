import React from 'react';
import { ChefHat, Twitter, Instagram, Linkedin, ArrowRight, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl text-white">
                        <ChefHat className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        NutriScan AI
                    </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                    Your personal AI nutritionist dedicated to making Indian cuisine healthier, one scan at a time.
                </p>
                <div className="flex gap-4">
                    <a href="https://x.com/AzmolWasim786" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-slate-100 hover:border-orange-200">
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/azmol-wasim-hussain-404778376/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-slate-100 hover:border-orange-200">
                        <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="https://www.instagram.com/wish_master_azmol_007/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-slate-100 hover:border-orange-200">
                        <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://github.com/azmolwasimhussain-ops" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-slate-100 hover:border-orange-200">
                        <Github className="w-4 h-4" />
                    </a>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">How it Works</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">API Access</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                    <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
                <p className="text-slate-500 text-sm mb-4 font-medium">Get the latest nutrition tips and updates.</p>
                <div className="flex gap-2">
                    <input type="email" placeholder="Enter your email" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-orange-300 transition-colors" />
                    <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-400 font-medium">
                © {new Date().getFullYear()} IndianCuisine NutriScan AI. All rights reserved.
            </div>
            <div className="flex gap-8 text-xs font-semibold text-slate-400">
                <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-600 transition-colors">Cookie Policy</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;