
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Check, Download, Loader2, Sparkles, Monitor, ScanEye, User, Layout } from 'lucide-react';
import Button from './ui/Button';
import { homogenizeImage, analyzeImage } from '../services/aiService';

interface AssetEngineProps {
    primaryColor: string;
    onApplyAsset?: (target: string, value: string) => void;
}

const AssetEngine: React.FC<AssetEngineProps> = ({ primaryColor, onApplyAsset }) => {
    const [image, setImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'duotone' | 'mockup' | 'analyze'>('duotone');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const res = reader.result as string;
            setImage(res.split(',')[1]);
            setMimeType(file.type);
            setProcessedImage(null);
            setAnalysisResult(null);
        };
        reader.readAsDataURL(file);
    };

    const handleAction = async () => {
        if (!image || !mimeType) return;
        setIsProcessing(true);
        try {
            if (mode === 'analyze') {
                const result = await analyzeImage(image, mimeType);
                setAnalysisResult(result);
            } else {
                const result = await homogenizeImage(image, mimeType, primaryColor, mode);
                if (result) setProcessedImage(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApply = (target: string) => {
        if (processedImage && onApplyAsset) {
            const dataUrl = `data:image/png;base64,${processedImage}`;
            onApplyAsset(target, dataUrl);
        }
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Asset Engine
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="space-y-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-gray-50 dark:bg-black/20"
                    >
                        {image ? (
                            <img src={`data:${mimeType};base64,${image}`} alt="Original" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <Upload size={24} className="mx-auto mb-2" />
                                <span className="text-xs font-bold">Upload Image</span>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setMode('duotone')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'duotone' ? 'bg-primary text-black border-primary' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                        >
                            <Sparkles size={14} /> Duotone
                        </button>
                        <button 
                            onClick={() => setMode('mockup')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'mockup' ? 'bg-primary text-black border-primary' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                        >
                            <Monitor size={14} /> Mockup
                        </button>
                        <button 
                            onClick={() => setMode('analyze')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-2 ${mode === 'analyze' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'}`}
                        >
                            <ScanEye size={14} /> Analyze
                        </button>
                    </div>

                    <Button onClick={handleAction} disabled={!image || isProcessing} loading={isProcessing} className="w-full justify-center">
                        {mode === 'analyze' ? 'Analyze Image' : 'Generate Asset'}
                    </Button>
                </div>

                {/* Result Area */}
                <div className="w-full aspect-video rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-black/40 flex items-center justify-center relative overflow-hidden group">
                    {isProcessing ? (
                        <Loader2 size={32} className="animate-spin text-gray-400" />
                    ) : analysisResult ? (
                        <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar bg-white dark:bg-black/80 text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {analysisResult}
                        </div>
                    ) : processedImage ? (
                        <>
                            <img src={`data:image/png;base64,${processedImage}`} alt="Processed" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                {onApplyAsset && (
                                    <button 
                                        onClick={() => handleApply('avatar')}
                                        className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-100 w-full justify-center"
                                    >
                                        <User size={14} /> Use as Profile
                                    </button>
                                )}
                                <a 
                                    href={`data:image/png;base64,${processedImage}`} 
                                    download="asset-processed.png"
                                    className="bg-primary text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:brightness-110 w-full justify-center"
                                >
                                    <Download size={14} /> Download
                                </a>
                            </div>
                        </>
                    ) : (
                        <span className="text-xs text-gray-400 font-medium">Result will appear here</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetEngine;
