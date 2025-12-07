import React, { useState, useEffect } from 'react';
import { FoodAnalysisResult } from '../types';
import MacroChart from './MacroChart';
import { generateSpeech, generateFoodVideo, editFoodImage } from '../services/geminiService';
import { 
  AlertTriangle, 
  Leaf, 
  Droplets, 
  Wheat, 
  Utensils, 
  Activity,
  Info,
  Save,
  Check,
  Flame,
  Footprints,
  Bike,
  Timer,
  Sparkles,
  Volume2,
  Video,
  Wand2,
  Loader2,
  Share2
} from 'lucide-react';

interface AnalysisResultProps {
  data: FoodAnalysisResult;
  imageBase64?: string;
  mimeType?: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, imageBase64, mimeType }) => {
  const [isSaved, setIsSaved] = useState(false);
  
  // AI Tools State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [showEditInput, setShowEditInput] = useState(false);

  useEffect(() => {
    setIsSaved(false);
    setVideoUrl(null);
    setEditedImageUrl(null);
    setShowEditInput(false);
  }, [data]);

  const handleSave = () => {
    try {
      const savedItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        analysis: data
      };

      const existingData = localStorage.getItem('nutriScanHistory');
      const history = existingData ? JSON.parse(existingData) : [];
      const updatedHistory = [savedItem, ...history].slice(0, 50);
      localStorage.setItem('nutriScanHistory', JSON.stringify(updatedHistory));
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save analysis", err);
    }
  };

  const handleTTS = async () => {
    try {
      setIsPlayingAudio(true);
      const text = `${data.dishName}. ${data.healthRatingReason}. This dish contains ${data.nutrition.calories} calories.`;
      const audioBuffer = await generateSpeech(text);
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlayingAudio(false);
      source.start();
    } catch (error) {
      console.error("TTS Error", error);
      setIsPlayingAudio(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!imageBase64 || !mimeType) return;
    
    // API Key Selection for Veo
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
         try {
           await window.aistudio.openSelectKey();
         } catch (e) {
           console.error("Key selection failed or cancelled", e);
           return;
         }
      }
    }

    setIsGeneratingVideo(true);
    try {
      const url = await generateFoodVideo(imageBase64, mimeType);
      setVideoUrl(url);
    } catch (error) {
      console.error("Video Gen Error", error);
      alert("Failed to generate video. Please ensure you have a valid paid API key selected.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleImageEdit = async () => {
    if (!imageBase64 || !mimeType || !editPrompt) return;
    
    setIsEditingImage(true);
    try {
      const newImageUrl = await editFoodImage(imageBase64, mimeType, editPrompt);
      setEditedImageUrl(newImageUrl);
    } catch (error) {
      console.error("Image Edit Error", error);
    } finally {
      setIsEditingImage(false);
    }
  };

  const getHealthColor = (rating: number) => {
    if (rating >= 8) return 'text-green-700 bg-green-50 border-green-200';
    if (rating >= 5) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const healthColorClass = getHealthColor(data.healthRating);

  const burnData = [
    { icon: <Footprints className="w-5 h-5 text-emerald-500" />, label: "Walking", time: Math.round((data.nutrition.calories / 250) * 60) },
    { icon: <Bike className="w-5 h-5 text-blue-500" />, label: "Cycling", time: Math.round((data.nutrition.calories / 450) * 60) },
    { icon: <Timer className="w-5 h-5 text-orange-500" />, label: "Running", time: Math.round((data.nutrition.calories / 650) * 60) },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Card */}
      <div className="glass-panel rounded-[2rem] overflow-hidden animate-pop-in hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.2)] transition-all duration-300">
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 relative z-10">
            <div className="flex-1 space-y-2">
              <h2 className="text-4xl font-black tracking-tight drop-shadow-sm">{data.dishName}</h2>
              <div className="flex items-center gap-2 text-orange-50 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <Utensils className="w-4 h-4" />
                <span className="font-semibold">{data.portionSize}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-start">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 font-bold text-sm border ${
                  isSaved 
                    ? 'bg-white text-orange-600 shadow-lg scale-100 border-white' 
                    : 'bg-white/20 text-white hover:bg-white/30 active:scale-95 border-white/20'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isSaved ? 'Saved' : 'Save Scan'}
              </button>

              <div className="px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center bg-white/20 backdrop-blur-md border border-white/20 shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Health Score</span>
                <div className="text-3xl font-black leading-none mt-1">{data.healthRating}<span className="text-lg font-medium opacity-70">/10</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/50 backdrop-blur-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Nutrition & Chart */}
            <div className="space-y-6 opacity-0 animate-fade-in-up delay-200">
              <div className="bg-white/60 rounded-[1.5rem] p-6 border border-white/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded-lg"><Activity className="w-5 h-5 text-orange-600" /></div>
                  Nutritional Breakdown
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 text-center transition-transform hover:scale-105">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Calories</div>
                    <div className="text-2xl font-black text-slate-900">{data.nutrition.calories}</div>
                    <div className="text-[10px] text-slate-400">kcal</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 text-center transition-transform hover:scale-105">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Sodium</div>
                    <div className="text-2xl font-black text-slate-900">{data.nutrition.sodium}</div>
                    <div className="text-[10px] text-slate-400">mg</div>
                  </div>
                   <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50 text-center transition-transform hover:scale-105">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Fiber</div>
                    <div className="text-2xl font-black text-slate-900">{data.nutrition.fiber}</div>
                    <div className="text-[10px] text-slate-400">g</div>
                  </div>
                </div>

                <div className="relative animate-pop-in" style={{ animationDelay: '400ms' }}>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <Utensils size={100} />
                   </div>
                   <MacroChart nutrition={data.nutrition} />
                </div>
              </div>

               {/* Burn It Off Section */}
               <div className="bg-white/60 p-6 rounded-[1.5rem] border border-white/60 shadow-sm animate-fade-in-up delay-300">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" /> Burn It Off
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                      {burnData.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-center border border-slate-50 shadow-sm transition-transform hover:scale-105 hover:shadow-md">
                              <div className="mb-2 p-2 bg-slate-50 rounded-full">{item.icon}</div>
                              <div className="font-black text-slate-800 text-lg">{item.time}m</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</div>
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6 opacity-0 animate-fade-in-up delay-300">
              
              {/* Chef's AI Studio (New Feature) */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-6 rounded-[1.5rem] border border-indigo-100 shadow-sm animate-fade-in-up delay-300 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-5 flex items-center gap-2 relative z-10">
                    <Sparkles className="w-4 h-4" /> Chef's AI Studio
                </h3>
                <div className="flex gap-3 mb-4 relative z-10">
                  <button 
                    onClick={handleTTS}
                    disabled={isPlayingAudio}
                    className="flex-1 flex flex-col items-center justify-center p-4 bg-white/80 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-lg hover:bg-white transition-all text-xs font-bold text-slate-600 group/btn"
                  >
                    {isPlayingAudio ? <Loader2 className="w-6 h-6 mb-2 animate-spin text-indigo-500" /> : <Volume2 className="w-6 h-6 mb-2 text-indigo-500 group-hover/btn:scale-110 transition-transform" />}
                    Listen
                  </button>
                  {imageBase64 && (
                    <>
                      <button 
                        onClick={() => setShowEditInput(!showEditInput)}
                        className="flex-1 flex flex-col items-center justify-center p-4 bg-white/80 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-lg hover:bg-white transition-all text-xs font-bold text-slate-600 group/btn"
                      >
                         <Wand2 className="w-6 h-6 mb-2 text-purple-500 group-hover/btn:scale-110 transition-transform" />
                         Remix
                      </button>
                      <button 
                        onClick={handleVideoGeneration}
                        disabled={isGeneratingVideo}
                        className="flex-1 flex flex-col items-center justify-center p-4 bg-white/80 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-lg hover:bg-white transition-all text-xs font-bold text-slate-600 group/btn"
                      >
                         {isGeneratingVideo ? <Loader2 className="w-6 h-6 mb-2 animate-spin text-pink-500" /> : <Video className="w-6 h-6 mb-2 text-pink-500 group-hover/btn:scale-110 transition-transform" />}
                         Animate
                      </button>
                    </>
                  )}
                </div>

                {/* Edit Input Area */}
                {showEditInput && (
                  <div className="animate-fade-in-up bg-white/90 p-4 rounded-2xl border border-indigo-100 mb-4 shadow-sm relative z-10">
                    <input 
                      type="text" 
                      placeholder="e.g., Make it look spicy, add steam..." 
                      className="w-full text-sm p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-slate-50 focus:bg-white transition-all"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    <button 
                      onClick={handleImageEdit}
                      disabled={!editPrompt || isEditingImage}
                      className="w-full py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors flex justify-center items-center gap-2 shadow-indigo-200 shadow-lg"
                    >
                      {isEditingImage && <Loader2 className="w-3 h-3 animate-spin" />}
                      Generate New Look
                    </button>
                  </div>
                )}

                {/* Generated Content Display */}
                {editedImageUrl && (
                   <div className="mt-4 animate-pop-in relative z-10">
                      <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Remixed Photo</p>
                      <div className="rounded-2xl overflow-hidden shadow-md border border-white">
                        <img src={editedImageUrl} alt="Edited" className="w-full" />
                      </div>
                   </div>
                )}

                {isGeneratingVideo && (
                   <div className="mt-4 p-6 bg-white/60 rounded-2xl text-center border border-indigo-50">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-3" />
                      <p className="text-xs font-semibold text-slate-600">Generating video with Veo...</p>
                      <p className="text-[10px] text-slate-400 mt-1">This may take a minute.</p>
                   </div>
                )}
                
                {videoUrl && (
                  <div className="mt-4 animate-pop-in relative z-10">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Generated Video</p>
                    <div className="rounded-2xl overflow-hidden shadow-md border border-white">
                        <video src={videoUrl} controls autoPlay loop className="w-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-transform hover:scale-105 shadow-sm border ${
                  data.dietaryInfo.type === 'Veg' || data.dietaryInfo.type === 'Vegan' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${data.dietaryInfo.type === 'Veg' || data.dietaryInfo.type === 'Vegan' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  {data.dietaryInfo.type}
                </span>
                
                {data.dietaryInfo.isGlutenFree && (
                  <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-transform hover:scale-105 shadow-sm border border-amber-200">
                    <Wheat className="w-3 h-3" /> Gluten Free
                  </span>
                )}
                {data.dietaryInfo.isDairyFree && (
                   <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-transform hover:scale-105 shadow-sm border border-blue-200">
                    <Droplets className="w-3 h-3" /> Dairy Free
                   </span>
                )}
              </div>

              {/* Ingredients */}
              <div className="bg-white/40 p-5 rounded-[1.5rem] border border-white/40">
                <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Ingredients Identified</h4>
                <div className="flex flex-wrap gap-2">
                  {data.ingredients.map((ing, i) => (
                    <span key={i} className="bg-white text-slate-600 border border-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-default shadow-sm">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analysis Text */}
              <div className={`p-5 rounded-[1.5rem] border ${healthColorClass} transition-all duration-300 hover:shadow-lg bg-opacity-60 backdrop-blur-sm`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-white/50 shrink-0 ${healthColorClass.split(' ')[0]}`}>
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-base">Health Analysis</h4>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">{data.healthRatingReason}</p>
                  </div>
                </div>
              </div>

              {/* Allergens */}
              {data.allergens.length > 0 && (
                <div className="bg-red-50 text-red-900 p-5 rounded-[1.5rem] border border-red-100 flex items-start gap-4 transition-all duration-300 hover:shadow-md">
                   <div className="p-2 rounded-full bg-red-100 shrink-0 text-red-600">
                     <AlertTriangle className="w-5 h-5" />
                   </div>
                  <div>
                    <span className="font-bold block text-sm uppercase tracking-wide mb-1">Allergen Warning</span>
                    <span className="text-sm font-medium">{data.allergens.join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Healthier Alternative */}
              <div className="bg-green-50 text-green-900 p-5 rounded-[1.5rem] border border-green-100 flex items-start gap-4 transition-all duration-300 hover:shadow-md">
                 <div className="p-2 rounded-full bg-green-100 shrink-0 text-green-600">
                    <Leaf className="w-5 h-5" />
                 </div>
                <div>
                   <span className="font-bold block text-sm uppercase tracking-wide mb-1">Smart Swap</span>
                   <p className="text-sm font-medium leading-relaxed">{data.healthierAlternative}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Footer / Disclaimer */}
      <div className="text-center text-slate-400 text-xs py-4 opacity-0 animate-fade-in-up delay-500 font-medium">
        AI-generated analysis. Consult a professional nutritionist for medical advice.
      </div>
    </div>
  );
};

export default AnalysisResult;