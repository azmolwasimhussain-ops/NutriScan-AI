import React, { useEffect, useState } from 'react';
import { X, Calendar, ChevronRight, Trash2, Clock } from 'lucide-react';
import { FoodAnalysisResult } from '../types';

interface HistoryItem {
  id: string;
  timestamp: string;
  analysis: FoodAnalysisResult;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: FoodAnalysisResult) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('nutriScanHistory');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    }
  }, [isOpen]);

  const clearHistory = () => {
    localStorage.removeItem('nutriScanHistory');
    setHistory([]);
  };

  const deleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('nutriScanHistory', JSON.stringify(updated));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col relative z-10 animate-pop-in border border-white/50">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md rounded-t-3xl">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Scan History
            </h2>
            <div className="flex gap-2">
                {history.length > 0 && (
                    <button onClick={clearHistory} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-full hover:bg-red-50" title="Clear All">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full hover:bg-slate-100">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
            {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No saved scans yet.</p>
                    <p className="text-sm opacity-60 mt-1">Analyze a dish and tap Save!</p>
                </div>
            ) : (
                history.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => onSelect(item.analysis)}
                        className="w-full text-left bg-white hover:bg-orange-50/50 p-4 rounded-xl border border-slate-100 hover:border-orange-200 transition-all group flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div>
                            <h3 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">{item.analysis.dishName}</h3>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                                <span>{item.analysis.nutrition.calories} kcal</span>
                            </div>
                        </div>
                        <button 
                          onClick={(e) => deleteItem(e, item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;