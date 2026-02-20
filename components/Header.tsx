import React from 'react';
import {
  Zap,
  Menu,
  ExternalLink,
  Moon,
  Sun,
  Edit2,
  Eye,
  RotateCcw,
  RotateCw,
  Palette
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  language: 'en' | 'zh';
  toggleLanguage: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onOpenStyleEditor: () => void;
  onOpenStyleConsultant: () => void;
  customThemes: any[];
  activeTheme: string;
  onApplyTheme: (themeId: string) => void;
  enabledStyles: string[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  isDark,
  viewMode,
  setViewMode,
  language,
  toggleLanguage,
  isEditing,
  setIsEditing,
  onOpenStyleEditor,
  canUndo,
  canRedo,
  onUndo,
  onRedo
  // Other props are accepted via interface but not used in this specific minimalist design
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 h-20 px-4 md:px-8 flex items-center justify-between">
      {/* BRAND */}
      <div className="flex items-center gap-4 min-w-fit">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,255,63,0.3)]">
          <Zap size={22} className="text-black" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-sm font-black tracking-widest uppercase italic">Christian Wu</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Multi-Disciplinary / AI-Enhanced</p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="hidden xl:flex items-center bg-white/5 rounded-full p-1 border border-white/5 mx-4">
        <button
          onClick={() => setViewMode('dashboard')}
          className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all ${viewMode === 'dashboard' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
        >
          DASHBOARD
        </button>
        <button
          onClick={() => setViewMode('node')}
          className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all ${viewMode === 'node' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
        >
          NODE FLOW
        </button>
        <button
          onClick={() => setViewMode('expert')}
          className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest transition-all ${viewMode === 'expert' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
        >
          CV EXPERT
        </button>
      </nav>

      {/* TOOLS & ACTIONS */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Undo/Redo */}
        <div className="hidden md:flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Edit Toggle */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[9px] font-black tracking-widest transition-all ${isEditing ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(212,255,63,0.2)]' : 'bg-white/5 border-white/10 text-gray-400'}`}
        >
          {isEditing ? <Edit2 size={12} /> : <Eye size={12} />}
          <span className="hidden sm:inline">{isEditing ? 'EDITING_ON' : 'PREVIEW_MODE'}</span>
        </button>

        {/* System Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleLanguage}
            className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-[10px] font-bold uppercase">{language}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={onOpenStyleEditor}
            className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Palette size={14} />
          </button>
          <button className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all xl:hidden">
            <Menu size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1 hidden md:block"></div>

        <button className="px-5 py-2.5 bg-white text-black text-[9px] font-black tracking-widest rounded-lg hover:bg-primary transition-all hidden md:flex items-center gap-2 group">
          CONNECT <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Header;
