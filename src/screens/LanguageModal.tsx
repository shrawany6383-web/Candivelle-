import React from 'react';
import { ChevronLeft, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface LanguageModalProps {
  currentLanguage: LanguageCode;
  t: TranslationDictionary;
  onSelectLanguage: (code: LanguageCode) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  currentLanguage,
  t,
  onSelectLanguage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-md max-h-[85vh] bg-gradient-to-b from-[#380e56] to-[#1d052d] border-t-4 sm:border-4 border-yellow-300 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#2b0844] border-b border-purple-500/30 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playButton();
              onClose();
            }}
            className="flex items-center gap-1 text-xs font-bold text-pink-200 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-300" />
            <h2 className="text-sm font-black text-white">{t.language}</h2>
          </div>

          <div className="w-10" />
        </div>

        {/* Languages List */}
        <div className="p-3 overflow-y-auto flex flex-col gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => {
                  soundManager.playButton();
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between border-2 transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-yellow-300 shadow-md ring-2 ring-yellow-400/40 text-white'
                    : 'bg-[#2a0845]/80 border-purple-400/20 text-purple-200 hover:bg-[#3b0f58]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-black">{lang.nativeName}</span>
                    <span className="text-[10px] text-purple-300 font-bold">{lang.name}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
