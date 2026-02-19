import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Image as ImageIcon, Loader2, Plus, ArrowUp, MessageSquare, Check, Eye, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { CustomTheme, Language } from '../types';
import { generateThemeFromImage, designExpertAgent } from '../services/aiService';
import Button from './ui/Button';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    imageBase64?: string | null;
    themePreview?: CustomTheme;
    suggestions?: string[];
}

interface StyleConsultantProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyTheme: (theme: CustomTheme) => void;
    onPreviewTheme?: (theme: CustomTheme) => void;
    onCancelPreview?: () => void;
    currentPreview?: CustomTheme | null;
    language?: Language;
}

const StyleConsultant: React.FC<StyleConsultantProps> = ({ 
    isOpen, onClose, onApplyTheme, onPreviewTheme, onCancelPreview, currentPreview 
}) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', text: '你好！我是你的 AI 風格顧問。你可以上傳一張圖片或描述你想要的風格，我會為你設計一套完整的視覺系統。', suggestions: ['Cyberpunk', 'Minimalist Swiss', 'Glassmorphism', 'Neubrutalism'] }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMime, setImageMime] = useState<string | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageBase64((reader.result as string).split(',')[1]);
                setImageMime(file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (textOverride?: string) => {
        const text = textOverride || input;
        if (!text.trim() && !imageBase64) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text, imageBase64: imageBase64 ? `data:${imageMime};base64,${imageBase64}` : null };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        const currentImg = imageBase64;
        const currentMime = imageMime;
        setImageBase64(null);
        setImageMime(null);
        setIsLoading(true);

        try {
            const result = await generateThemeFromImage(currentImg, currentMime, text);
            if (result) {
                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    text: `根據您的${currentImg ? '圖片' : '描述'}，我為您設計了「${result.name}」風格。${result.mood}`,
                    themePreview: {
                        ...result,
                        id: `ai-${Date.now()}`,
                        isAiGenerated: true,
                        sourceImage: currentImg ? `data:${currentMime};base64,${currentImg}` : undefined
                    },
                    suggestions: ['調整配色', '更簡約一點', '更具未來感']
                };
                setMessages(prev => [...prev, assistantMsg]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed right-0 top-0 h-full bg-white dark:bg-[#0D0D0D] shadow-2xl z-[101] flex flex-col border-l border-gray-100 dark:border-gray-800 transition-all ${isMinimized ? 'w-20' : 'w-full max-w-md'}`}
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            {!isMinimized && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Sparkles size={18} />
                                    </div>
                                    <span className="font-bold text-sm">AI Style Consultant</span>
                                </div>
                            )}
                            <div className="flex gap-1 ml-auto">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-black rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none'}`}>
                                            {msg.imageBase64 && <img src={msg.imageBase64} className="w-full h-32 object-cover rounded-lg mb-2" alt="upload" />}
                                            {msg.text}
                                        </div>
                                        {msg.themePreview && (
                                            <div className="mt-3 w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                                                    <span className="font-bold text-sm">{msg.themePreview.name}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 mb-4">
                                                    {Object.values(msg.themePreview.colors).slice(0, 4).map((c, i) => (
                                                        <div key={i} className="h-8 rounded-md border border-black/10" style={{ backgroundColor: c as string }}></div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" onClick={() => onPreviewTheme?.(msg.themePreview!)} className="flex-1 text-xs">Preview</Button>
                                                    <Button variant="primary" onClick={() => { onApplyTheme(msg.themePreview!); onClose(); }} className="flex-1 text-xs">Apply</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && <div className="text-xs text-gray-400 animate-pulse">Consultant is thinking...</div>}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {!isMinimized && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                {imageBase64 && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
                                        <img src={`data:${imageMime};base64,${imageBase64}`} className="w-full h-full object-cover" alt="preview" />
                                        <button onClick={() => setImageBase64(null)} className="absolute top-0 right-0 bg-black/60 text-white p-0.5"><X size={10}/></button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
                                        <ImageIcon size={20} />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    <div className="flex-1 relative">
                                        <input
                                            value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="描述或上傳風格參考圖..."
                                            className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 text-sm outline-none border-none"
                                        />
                                        <button onClick={() => handleSendMessage()} className="absolute right-2 top-1.5 p-1.5 bg-primary text-black rounded-lg">
                                            <ArrowUp size={16} strokeWidth={3} />
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
