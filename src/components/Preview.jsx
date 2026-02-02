import React, { useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { generateSandboxHtml } from '../engine/runtime';

export default function Preview({ workspace, isLoading }) {
    const sandboxHtml = useMemo(() => {
        if (!workspace) return null;
        return generateSandboxHtml(workspace);
    }, [workspace]);

    return (
        <div className="relative w-full aspect-[9/19] max-h-[720px] bg-white rounded-[3rem] shadow-[0_0_0_12px_#1e293b] border-[12px] border-slate-900 overflow-hidden group">
            {/* Top Bar / Notch Design */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 flex items-center justify-center z-20">
                <div className="w-16 h-1 bg-slate-800 rounded-full" />
            </div>

            <div className="w-full h-full relative overflow-hidden bg-white">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/80 backdrop-blur-sm z-10">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-brand-100 rounded-full animate-pulse" />
                            <Loader2 className="absolute top-0 left-0 w-12 h-12 text-brand-500 animate-spin" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Booting Engine...</p>
                    </div>
                ) : !workspace ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-sm font-semibold text-slate-300">No active process.</p>
                    </div>
                ) : (
                    <iframe
                        srcDoc={sandboxHtml}
                        className="w-full h-full border-none"
                        title="Preview Sandbox"
                        sandbox="allow-scripts"
                    />
                )}
            </div>

            {/* Replit-Style Status Bar */}
            {workspace && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-800 flex items-center gap-2 z-20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Live Runtime · 60fps</span>
                </div>
            )}
        </div>
    );
}
