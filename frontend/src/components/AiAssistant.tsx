import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic } from 'lucide-react';

interface AiAssistantProps {
  isListening: boolean;
  isAiProcessing: boolean;
  aiResult: string;
  onVoiceCommand: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isListening, isAiProcessing, aiResult, onVoiceCommand
}) => (
  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative">
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Mic size={18} />
        </div>
        <h3 className="font-bold">Trợ lý AI Yolo</h3>
      </div>
      
      <div className="flex flex-col items-center py-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onVoiceCommand}
          className={`relative p-8 rounded-full transition-all ${
            isListening 
              ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
              : 'bg-white/20 hover:bg-white/30 border border-white/30'
          }`}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                <Mic size={32} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Mic size={32} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <div className="mt-6 text-center min-h-[48px] flex items-center justify-center px-4">
          <p className={`text-sm font-medium transition-opacity duration-300 ${isAiProcessing ? 'opacity-100' : 'opacity-80'}`}>
            {aiResult}
          </p>
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2">Lệnh phổ biến</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Bật đèn"</span>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Tắt quạt"</span>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Nhiệt độ?"</span>
        </div>
      </div>
    </div>
  </div>
);
