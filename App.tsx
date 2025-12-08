import React, { useState, useRef } from 'react';
import { Camera, Type, Upload, X, Loader2, ChefHat, ImagePlus, History, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import { FoodAnalysisResult, InputMode } from './types';
import { analyzeFoodWithGemini } from './services/geminiService';
import AnalysisResult from './components/AnalysisResult';
import HeroSection from './components/HeroSection';
import HistoryModal from './components/HistoryModal';
import FeaturesSection from './components/FeaturesSection';
import SamplePreview from './components/SamplePreview';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import CameraCapture from './components/CameraCapture';

// Abstract Spice SVG Components for Background
const SpiceLeaf = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 2C7 2 3 7 3 12C3 17 7 22 12 22C17 22 21 17 21 12C21 7 17 2 12 2ZM12 20C8 20 5 16 5 12C5 8 8 5 12 5C16 5 19 8 19 12C19 16 16 20 12 20Z" opacity="0.1"/>
    <path d="M12 4C12 4 11 8 8 12C5 16 12 20 12 20C12 20 19 16 16 12C13 8 12 4 12 4Z" />
  </svg>
);

const SpiceStar = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 2L14.5 9L22 9.5L16 14L18 21L12 17L6 21L8 14L2 9.5L9.5 9L12 2Z" />
  </svg>
);

// SVG Divider Component
const WaveDivider = ({ flip = false, className = "fill-white/40" }: { flip?: boolean, className?: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}>
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px] ${className}`}>
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<InputMode>(InputMode.UPLOAD);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please upload an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
           setMimeType(matches[1]);
           setSelectedImage(matches[2]); 
        }
      };
      reader.readAsDataURL(file);
      setError(null);
      setResult(null);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    const matches = imageSrc.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        setMimeType(matches[1]);
        setSelectedImage(matches[2]);
        setIsCameraOpen(false);
        setError(null);
        setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (mode === InputMode.TEXT && !inputText.trim()) {
      setError("Please enter a food description.");
      return;
    }
    if (mode === InputMode.UPLOAD && !selectedImage) {
      setError("Please upload an image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeFoodWithGemini(
        mode === InputMode.TEXT ? inputText : undefined,
        mode === InputMode.UPLOAD && selectedImage ? selectedImage : undefined,
        mode === InputMode.UPLOAD && mimeType ? mimeType : undefined
      );
      setResult(data);
    } catch (err) {
      setError("Failed to analyze. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setSelectedImage(null);
    setMimeType(null);
    setInputText('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getPreviewSrc = () => {
    if (selectedImage && mimeType) {
      return `data:${mimeType};base64,${selectedImage}`;
    }
    return null;
  };

  const handleSelectHistory = (savedResult: FoodAnalysisResult) => {
    setResult(savedResult);
    setIsHistoryOpen(false);
  }

  // Predefined hints for the UI
  const popularDishes = ["Butter Chicken", "Palak Paneer", "Masala Dosa", "Biryani", "Samosa"];

  return (
    <div className="min-h-screen font-sans text-slate-900 relative selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden flex flex-col">
      <Navbar />
      
      {isCameraOpen && (
        <CameraCapture 
            onCapture={handleCameraCapture} 
            onClose={() => setIsCameraOpen(false)} 
        />
      )}

      {/* Background Decor Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         {/* Abstract Spices - Floating */}
         <SpiceLeaf className="absolute top-[10%] left-[5%] w-32 h-32 text-green-800/5 animate-float-slow" />
         <SpiceStar className="absolute top-[20%] right-[10%] w-24 h-24 text-orange-800/5 animate-float-medium" />
         <SpiceLeaf className="absolute bottom-[20%] left-[15%] w-40 h-40 text-amber-800/5 animate-float-slow" style={{ animationDelay: '2s' }} />
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header Bar Actions (History) */}
      <div className="fixed top-24 right-6 z-40 hidden lg:block">
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="bg-white/50 backdrop-blur-md p-3 rounded-full text-slate-500 hover:text-orange-600 hover:bg-white shadow-sm hover:shadow-lg transition-all border border-white/50"
          title="History"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelect={handleSelectHistory}
      />

      <div className="flex-grow w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <HeroSection />
        </div>

        {/* Upload/Analysis Section */}
        <div id="upload-section" className="scroll-mt-28 mb-16 px-4">
            <div className="max-w-4xl mx-auto">
              {!result && (
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden transition-all duration-500 animate-pop-in shadow-[0_30px_60px_-15px_rgba(249,115,22,0.1)] border border-white ring-1 ring-white/60 relative">
                  
                  {/* Glass Shine */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50"></div>

                  {/* Tab Navigation */}
                  <div className="flex p-3 gap-3 bg-white/40 border-b border-orange-100/50">
                    <button
                      onClick={() => setMode(InputMode.UPLOAD)}
                      className={`flex-1 py-4 text-center font-bold text-sm md:text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
                        mode === InputMode.UPLOAD 
                          ? 'bg-white text-orange-600 shadow-md shadow-orange-500/5 border border-white' 
                          : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                      }`}
                    >
                      <Camera className={`w-5 h-5 ${mode === InputMode.UPLOAD ? 'text-orange-500' : ''}`} />
                      Upload Photo
                    </button>
                    <button
                      onClick={() => setMode(InputMode.TEXT)}
                      className={`flex-1 py-4 text-center font-bold text-sm md:text-base rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
                        mode === InputMode.TEXT 
                          ? 'bg-white text-orange-600 shadow-md shadow-orange-500/5 border border-white' 
                          : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                      }`}
                    >
                      <Type className={`w-5 h-5 ${mode === InputMode.TEXT ? 'text-orange-500' : ''}`} />
                      Describe Dish
                    </button>
                  </div>

                  <div className="p-6 md:p-12 relative">
                    {mode === InputMode.UPLOAD ? (
                      <div className="space-y-8 animate-fade-in-up">
                        <div 
                          className={`relative border-[3px] border-dashed rounded-[2rem] h-80 md:h-96 flex flex-col items-center justify-center transition-all duration-300 group ${
                            selectedImage 
                              ? 'border-orange-300 bg-orange-50/20' 
                              : 'border-slate-200 hover:border-orange-200'
                          }`}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          
                          {selectedImage ? (
                            <div className="relative w-full h-full p-4 animate-pop-in">
                              <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-lg transition-shadow bg-white">
                                  <img 
                                  src={getPreviewSrc() || ''} 
                                  alt="Preview" 
                                  className="w-full h-full object-contain" 
                                  />
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); resetAnalysis(); }}
                                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-slate-700 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110 border border-slate-100"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-4 w-full max-w-md mx-auto">
                              <div className="w-24 h-24 bg-gradient-to-tr from-orange-100 to-amber-50 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] ring-8 ring-white mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <ImagePlus className="w-10 h-10 md:w-12 md:h-12 drop-shadow-sm" />
                              </div>
                              
                              <p className="text-slate-900 font-bold text-xl mb-8 tracking-tight">
                                  Drop your food photo here
                              </p>

                              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group/btn"
                                >
                                    <ImageIcon className="w-5 h-5 text-slate-500 group-hover/btn:text-slate-700" />
                                    Gallery
                                </button>
                                <span className="text-slate-300 font-bold text-sm uppercase">or</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-orange-100 text-orange-700 rounded-2xl font-bold hover:bg-orange-200 transition-colors flex items-center justify-center gap-2 group/btn border border-orange-200"
                                >
                                    <Camera className="w-5 h-5 text-orange-600" />
                                    Take Photo
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Visual Hints */}
                        {!selectedImage && (
                          <div className="text-center space-y-4">
                              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions
                              </div>
                              <div className="flex flex-wrap justify-center gap-2">
                                  {popularDishes.map((dish) => (
                                      <span key={dish} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs md:text-sm font-semibold text-slate-600 shadow-sm cursor-default hover:border-orange-200 hover:text-orange-600 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                          {dish}
                                      </span>
                                  ))}
                              </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6 animate-fade-in-up">
                        <label htmlFor="description" className="block text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                          <Type className="w-4 h-4 text-orange-500" />
                          Describe your dish in detail
                        </label>
                        <div className="relative group">
                          <textarea
                              id="description"
                              rows={8}
                              className="w-full p-6 rounded-[2rem] border border-slate-200 bg-white/50 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 outline-none transition-all duration-300 resize-none text-lg text-slate-700 placeholder:text-slate-400 shadow-inner group-hover:bg-white/80"
                              placeholder="e.g., A plate of vegetable biryani with cucumber raita..."
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                          />
                          <div className="absolute bottom-6 right-6 text-xs text-slate-400 font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm">
                              {inputText.length} chars
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Try:</span>
                            {popularDishes.map((dish) => (
                                <button 
                                  key={dish}
                                  onClick={() => setInputText(dish)}
                                  className="shrink-0 px-4 py-2 bg-white hover:bg-orange-50 border border-slate-100 hover:border-orange-200 rounded-xl text-xs font-bold text-slate-600 hover:text-orange-600 transition-all shadow-sm"
                                >
                                    {dish}
                                </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="mt-8 p-4 bg-red-50/90 border border-red-100 text-red-600 rounded-2xl text-sm text-center animate-fade-in-up backdrop-blur-sm flex items-center justify-center gap-2 shadow-sm">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <X className="w-3 h-3" />
                        </div>
                        {error}
                      </div>
                    )}

                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading || (mode === InputMode.TEXT && !inputText) || (mode === InputMode.UPLOAD && !selectedImage)}
                      className={`w-full mt-10 py-5 md:py-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden group shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] ${
                        isLoading 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-500/30'
                      }`}
                    >
                      {!isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-150%] transition-transform duration-1000 group-hover:translate-x-[150%]"></div>
                      )}
                      
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Analyzing Ingredients...</span>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                              <ChefHat className="w-6 h-6 transition-transform group-hover:rotate-12" />
                              <Sparkles className="w-3 h-3 absolute -top-1 -right-2 text-yellow-200 animate-pulse" />
                          </div>
                          <span>Analyze Food</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {result && (
                <div className="space-y-8 mt-8">
                  <div className="flex justify-start animate-fade-in-up">
                    <button 
                      onClick={resetAnalysis}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-orange-600 font-bold text-sm transition-all duration-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md border border-slate-200 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Analyze Another Dish
                    </button>
                  </div>
                  <AnalysisResult 
                    data={result} 
                    imageBase64={selectedImage || undefined}
                    mimeType={mimeType || undefined}
                  />
                </div>
              )}
            </div>
        </div>
        
        {/* Marketing Sections - Only show when no result is present */}
        {!result && (
          <>
            <WaveDivider className="fill-white/40" />
            <SamplePreview />
            <FeaturesSection />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;