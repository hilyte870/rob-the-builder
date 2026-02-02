import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Mobile Preview Renderer
 * Strictly renders UI based on the Blueprint JSON.
 */
export default function Preview({ blueprint }) {
    const { style, pages, name } = blueprint;
    const activePage = pages[0]?.name || 'Home';

    return (
        <div className="w-full aspect-[9/19.5] bg-white rounded-[3rem] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            </div>

            {/* App Content */}
            <div className="flex-1 flex flex-col pt-10 px-4 bg-slate-50 overflow-y-auto">
                <header className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-xl font-bold tracking-tight">{name}</h2>
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                </header>

                <main className="space-y-4">
                    <div
                        className="h-32 rounded-2xl flex items-center justify-center p-6 text-white overflow-hidden relative"
                        style={{ backgroundColor: style.primaryColor }}
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                        <p className="text-lg font-bold">Welcome back to {activePage}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: style.primaryColor }} />
                                </div>
                                <div className="space-y-1">
                                    <div className="h-2 w-12 bg-slate-100 rounded" />
                                    <div className="h-1.5 w-8 bg-slate-50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Bottom Nav */}
            <nav className="h-16 bg-white border-t border-slate-100 px-6 flex items-center justify-around pb-2">
                {pages.slice(0, 4).map((page, idx) => {
                    const IconComponent = LucideIcons[page.icon] || LucideIcons.Square;
                    return (
                        <div key={page.id} className="flex flex-col items-center gap-1">
                            <IconComponent
                                size={20}
                                className={idx === 0 ? 'text-slate-900' : 'text-slate-300'}
                                style={idx === 0 ? { color: style.primaryColor } : {}}
                            />
                            <span className={`text-[9px] font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                {page.name.toUpperCase()}
                            </span>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
