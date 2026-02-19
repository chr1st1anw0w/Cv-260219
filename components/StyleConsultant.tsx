
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Image as ImageIcon, Sparkles, Wand2, Plus, ArrowUp, Zap, Palette, Layout, Loader2, Info, BookOpen, Check, Eye, Copy } from 'lucide-react';
import { CustomTheme } from '../types';
import { designExpertAgent } from '../services/aiService';
import Button from './ui/Button';

interface StyleConsultantProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyTheme: (theme: CustomTheme) => void;
    onPreviewTheme?: (theme: CustomTheme) => void;
    onCancelPreview?: () => void;
    currentPreview?: CustomTheme | null;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    themePreview?: CustomTheme;
    suggestions?: string[];
    image?: string;
}

const StyleConsultant: React.FC<StyleConsultantProps> = ({ 
    isOpen, onClose, onApplyTheme, onPreviewTheme, onCancelPreview, currentPreview 
}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'ai',
            text: "你好！我是你的專屬設計顧問。\n\n**✨ UI/UX Pro Max Skill 已啟用**\n我可以存取專業的設計資料庫 (Neubrutalism, Glassmorphism, Aurora UI 等)。\n\n請告訴我你的**目標產業**（例如：金融、時尚）或**偏好風格**。",
            suggestions: ["建立 Neubrutalism 風格", "分析這張圖片", "建立 Fintech 主題", "我想要 Glassmorphism"]
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMime, setImageMime] = useState<string | null>(null);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Minimize on preview
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // Minimize window when preview starts
    useEffect(() => {
        if (currentPreview) {
            setIsMinimized(true);
        } else {
            setIsMinimized(false);
        }
    }, [currentPreview]);

    const handleSendMessage = async (text: string = input) => {
        if (!text.trim() && !imageBase64) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            image: imageBase64 || undefined
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsMinimized(false); // Maximize to show loading
        
        setIsLoading(true);

        try {
            const imageContext = imageBase64 && imageMime ? { data: imageBase64, mimeType: imageMime } : undefined;
            const result = await designExpertAgent(messages, text, imageContext);
            
            // Clear image after sending
            setImageBase64(null);
            setImageMime(null);

            if (result) {
                const newAiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    text: result.message,
                    suggestions: result.suggestedPrompts,
                    themePreview: result.isThemeGenerated && result.generatedTheme ? {
                        ...result.generatedTheme,
                        id: `consult-${Date.now()}`,
                    } : undefined
                };
                setMessages(prev => [...prev, newAiMsg]);
            } else {
                throw new Error("Empty response from AI");
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: "抱歉，我的設計靈感暫時枯竭了。請再試一次，或換個說法。",
                suggestions: ["重試", "生成簡單的藍色主題"]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageBase64(result.split(',')[1]);
                setImageMime(file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetChat = () => {
        setMessages([{
            id: 'init-reset',
            role: 'ai',
            text: "讓我們重新開始。請上傳參考圖或描述你想要的產業風格 (Pro Max Database Ready)。",
            suggestions: ["建立 Aurora UI 主題", "建立日式極簡風格"]
        }]);
        setInput("");
        setImageBase64(null);
        if (onCancelPreview) onCancelPreview();
    };

    const copyColor = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Mobile Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden ${isMinimized ? 'hidden' : ''}`}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? '60px' : '650px',
                            width: isMinimized ? '300px' : '420px',
                            borderRadius: '24px'
                        }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed inset-x-0 bottom-6 mx-auto md:mx-0 md:right-6 bg-white dark:bg-[#1A1A1A] shadow-2xl border border-gray-200 dark:border-gray-800 z-[60] flex flex-col overflow-hidden font-sans transition-all duration-300 ${isMinimized ? 'cursor-pointer hover:scale-105' : ''}`}
                        onClick={() => isMinimized && setIsMinimized(false)}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm h-[60px]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <span className="font-bold text-sm dark:text-white block whitespace-nowrap">
                                        {isMinimized ? 'Previewing...' : 'Design Expert'}
                                    </span>
                                    {!isMinimized && (
                                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                                            <BookOpen size={10} /> Pro Max Active
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {isMinimized && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold"
                                    >
                                        Expand
                                    </button>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        {!isMinimized && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD] dark:bg-[#111]">
                            <div className="p-6 space-y-6">
                                {messages.map((msg) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id} 
                                        className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        {/* Text Bubble */}
                                        <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-br-none' 
                                            : 'bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                        }`}>
                                            {msg.image && (
                                                <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <img src={`data:image/png;base64,${msg.image}`} alt="Upload" className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>

                                        {/* Theme Preview Card with Token details */}
                                        {msg.themePreview && (
                                            <div className="w-[90%] bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg overflow-hidden">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{msg.themePreview.name}</span>
                                                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">Pro Max</span>
                                                </div>
                                                
                                                {/* Color Palette Preview */}
                                                <div className="flex gap-1 mb-4 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer">
                                                    {Object.values(msg.themePreview.colors).slice(0, 5).map((color: any, cIdx) => (
                                                        <div 
                                                            key={cIdx} 
                                                            className="flex-1 h-full hover:opacity-90 transition-opacity relative group" 
                                                            style={{backgroundColor: color as string}} 
                                                            title={color as string}
                                                            onClick={() => copyColor(color as string)}
                                                        >
                                                            {copiedColor === color && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                    <Check size={12} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Token Specs */}
                                                {msg.themePreview.designSystem && (
                                                    <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] text-gray-500">
                                                        <div className="bg-gray-50 dark:bg-black/20 p-2 rounded flex justify-between">
                                                            <span>Style:</span> <span className="font-mono text-gray-900 dark:text-white uppercase">{msg.themePreview.designSystem.iconStyle || 'STD'}</span>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-black/20 p-2 rounded flex justify-between">
                                                            <span>Radius:</span> <span className="font-mono text-gray-900 dark:text-white">{msg.themePreview.designSystem.borderRadius}px</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button 
                                                        variant="ghost"
                                                        onClick={() => onPreviewTheme && onPreviewTheme(msg.themePreview!)} 
                                                        className="w-full py-2 text-xs font-bold rounded-xl bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 border-none shadow-md"
                                                    >
                                                        <Eye size={14} className="mr-2" /> 預覽 (Preview)
                                                    </Button>
                                                    <Button 
                                                        variant="primary"
                                                        onClick={() => { onApplyTheme(msg.themePreview!); onClose(); }} 
                                                        className="w-full py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200 dark:shadow-none"
                                                    >
                                                        <Check size={14} className="mr-2" /> 套用 (Apply)
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Suggestion Chips */}
                                        {msg.suggestions && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {msg.suggestions.map((sug, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => handleSendMessage(sug)}
                                                        className="px-3 py-1.5 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-full text-[10px] font-medium text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors shadow-sm flex items-center gap-1"
                                                    >
                                                        <Plus size={10} /> {sug}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center">
                                            <Loader2 size={16} className="animate-spin text-purple-500" />
                                        </div>
                                        <div className="bg-white dark:bg-[#1E1E1E] px-4 py-3 rounded-2xl rounded-bl-none text-xs text-gray-500 border border-gray-100 dark:border-gray-800">
                                            正在搜尋 Pro Max 資料庫... (Thinking)
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        )}

                        {/* Input Area */}
                        {!isMinimized && (
                        <div className="p-4 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-gray-800 shrink-0">
                            {imageBase64 && (
                                <div className="absolute bottom-20 left-6 z-10">
                                    <div className="relative group">
                                        <img src={`data:${imageMime};base64,${imageBase64}`} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg" alt="preview" />
                                        <button onClick={() => { setImageBase64(null); setImageMime(null); }} className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={10} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="bg-gray-100 dark:bg-[#252525] rounded-[24px] p-2 flex items-center gap-2 relative">
                                <button 
                                    onClick={resetChat}
                                    className="p-2.5 rounded-full bg-white dark:bg-[#333] text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200 dark:border-gray-700 shrink-0"
                                    title="New Chat"
                                >
                                    <Plus size={18} />
                                </button>

                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="描述你想要的風格 (e.g. Cyberpunk)..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-900 dark:text-white placeholder-gray-400 min-w-0"
                                />

                                <div className="flex items-center gap-2 shrink-0">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center gap-1 text-xs font-bold"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload} 
                                    />
                                    
                                    <button 
                                        onClick={() => handleSendMessage()}
                                        disabled={!input.trim() && !imageBase64}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                            input.trim() || imageBase64 
                                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' 
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <ArrowUp size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StyleConsultant;
