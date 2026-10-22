import React, { useState } from 'react';
import { ChevronLeft, Smartphone, ShieldCheck, Download, Copy, Check, Terminal } from 'lucide-react';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface AndroidPackScreenProps {
  t: TranslationDictionary;
  onBack: () => void;
}

export const AndroidPackScreen: React.FC<AndroidPackScreenProps> = ({ t, onBack }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    soundManager.playButton();
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const capacitorConfig = `{
  "appId": "com.candivelle.match3",
  "appName": "CANDIVELLE",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#1e0836",
      "showSpinner": false
    }
  }
}`;

  const buildCommands = `# 1. Build the production web bundle
npm run build

# 2. Add Capacitor Android wrapper (if not already added)
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init CANDIVELLE com.candivelle.match3 --web-dir dist
npx cap add android

# 3. Copy web assets to Android native project
npx cap sync android

# 4. Open in Android Studio to build APK or AAB
npx cap open android`;

  const keystoreCmd = `keytool -genkey -v -keystore candivelle-release.keystore -alias candivelle -keyalg RSA -keysize 2048 -validity 10000`;

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#200633] via-[#3d0959] to-[#1b052d] overflow-y-auto pb-24 select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-[#2d094c]/90 border-b border-purple-500/30 sticky top-0 z-20 shadow-md">
        <button
          onClick={() => {
            soundManager.playButton();
            onBack();
          }}
          className="flex items-center gap-1 text-sm font-bold text-white bg-purple-900/60 hover:bg-purple-800 px-3 py-1.5 rounded-full border border-purple-400/50 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-black text-white">{t.androidGuide}</h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="w-full max-w-md mx-auto p-4 text-white text-xs leading-relaxed flex flex-col gap-4">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 border-2 border-emerald-300 p-4 shadow-xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow">
            🤖
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Android Packaging Specification</h2>
            <p className="text-[11px] text-emerald-100 font-medium">
              Ready for Google Play Store, Indus Appstore &amp; Amazon Appstore
            </p>
          </div>
        </div>

        {/* Specs Table */}
        <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-4 shadow flex flex-col gap-2">
          <h3 className="text-xs font-black uppercase text-pink-300">Package Identity</h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-purple-950/60 p-2 rounded-xl">
              <span className="text-purple-300 block text-[10px]">Application ID</span>
              <span className="font-mono font-bold text-yellow-300">com.candivelle.match3</span>
            </div>
            <div className="bg-purple-950/60 p-2 rounded-xl">
              <span className="text-purple-300 block text-[10px]">App Name</span>
              <span className="font-bold text-white">CANDIVELLE</span>
            </div>
            <div className="bg-purple-950/60 p-2 rounded-xl">
              <span className="text-purple-300 block text-[10px]">Target SDK</span>
              <span className="font-bold text-emerald-300">Android 14 (API 34+)</span>
            </div>
            <div className="bg-purple-950/60 p-2 rounded-xl">
              <span className="text-purple-300 block text-[10px]">Version / Code</span>
              <span className="font-bold text-cyan-300">v1.0.0 (Code 101)</span>
            </div>
          </div>
        </div>

        {/* Build Commands */}
        <div className="rounded-2xl bg-[#25073a]/90 border border-purple-400/40 p-4 shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-yellow-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" /> CLI Build Script
            </span>
            <button
              onClick={() => copyToClipboard(buildCommands, 'build')}
              className="text-[10px] text-pink-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md"
            >
              {copiedSection === 'build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'build' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-black/50 p-3 rounded-xl overflow-x-auto text-[10px] font-mono text-emerald-300 leading-normal">
            {buildCommands}
          </pre>
        </div>

        {/* Capacitor Configuration */}
        <div className="rounded-2xl bg-[#25073a]/90 border border-purple-400/40 p-4 shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-yellow-300">capacitor.config.json</span>
            <button
              onClick={() => copyToClipboard(capacitorConfig, 'config')}
              className="text-[10px] text-pink-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md"
            >
              {copiedSection === 'config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedSection === 'config' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-black/50 p-3 rounded-xl overflow-x-auto text-[10px] font-mono text-cyan-300 leading-normal">
            {capacitorConfig}
          </pre>
        </div>

        {/* Signing & Keystore Instructions */}
        <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-4 shadow flex flex-col gap-2">
          <h3 className="text-xs font-black uppercase text-pink-300">Release Keystore (AAB/APK)</h3>
          <p className="text-purple-200 text-[11px]">
            To publish to the Google Play Store, generate a secure release keystore with Keytool:
          </p>
          <pre className="bg-black/50 p-3 rounded-xl overflow-x-auto text-[10px] font-mono text-yellow-200 leading-normal">
            {keystoreCmd}
          </pre>
          <p className="text-[10px] text-pink-300">
            Keep this keystore safe and never commit secrets to public source control.
          </p>
        </div>
      </div>
    </div>
  );
};
