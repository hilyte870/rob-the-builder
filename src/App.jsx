import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, Smartphone, Layout, Palette, Shield,
    CreditCard, ChevronLeft, Loader2, Share2, Save, LogOut,
    Briefcase, Trash2, ExternalLink
} from 'lucide-react';

// Engine Imports
import { interpretPrompt } from './engine/ai';
import { createInitialBlueprint } from './engine/blueprint';
import * as Storage from './engine/storage';

// Component Imports
import Preview from './components/Preview';

const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
    const variants = {
        primary: 'bg-brand-300 text-brand-900 hover:bg-brand-400 font-semibold',
        secondary: 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-50',
        dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    };

    return (
        <button
            className={`px-6 py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : children}
        </button>
    );
};

export default function App() {
    const [view, setView] = useState('landing'); // 'landing', 'dashboard', 'editor'
    const [user, setUser] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [blueprint, setBlueprint] = useState(null);
    const [isBuilding, setIsBuilding] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const session = Storage.getSession();
        if (session) setUser(session);
        setProjects(Storage.getProjects());
    }, []);

    const handleLogin = () => {
        const email = prompt || 'user@example.com';
        Storage.loginUser(email);
        setUser({ email, isLoggedIn: true });
        setView('dashboard');
    };

    const handleBuild = async () => {
        if (!prompt.trim()) return;
        setIsBuilding(true);
        try {
            const generated = await interpretPrompt(prompt);
            setBlueprint(generated);
            setView('editor');
        } catch (err) {
            console.error(err);
        } finally {
            setIsBuilding(false);
        }
    };

    const handleSave = () => {
        const updated = Storage.saveProject(blueprint);
        setProjects(updated);
        setTimeout(() => setView('dashboard'), 500);
    };

    const handleDelete = (id) => {
        const updated = Storage.deleteProject(id);
        setProjects(updated);
    };

    const updateBlueprint = (key, value) => {
        setBlueprint(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200">
            <div className="max-w-[1200px] mx-auto min-h-screen relative flex flex-col md:flex-row justify-center items-start lg:gap-10">

                <div className="w-full max-w-[440px] bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-slate-100 z-10 shrink-0">

                    <AnimatePresence mode="wait">
                        {view === 'landing' && (
                            <motion.div
                                key="landing"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col p-8 pt-20"
                            >
                                <div className="flex items-center gap-3 mb-12">
                                    <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
                                        <Smartphone className="text-brand-600 h-6 w-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rob</h1>
                                        <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest text-left">The Builder Alpha</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-4xl font-bold leading-tight text-slate-900">
                                        Build the app you've <span className="text-brand-300">always</span> wanted.
                                    </h2>
                                </div>

                                <div className="mt-12 space-y-4">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe the app you want to build..."
                                        className="w-full h-44 bg-slate-50 border-2 border-slate-100 focus:border-brand-300 rounded-[2rem] p-6 text-lg transition-all outline-none resize-none shadow-inner"
                                    />
                                    <Button
                                        onClick={user ? handleBuild : handleLogin}
                                        className="w-full text-xl py-6 rounded-[1.5rem]"
                                        disabled={!prompt.trim() || isBuilding}
                                        isLoading={isBuilding}
                                    >
                                        {user ? 'Build App' : 'Get Started'} <ArrowRight size={20} />
                                    </Button>
                                </div>

                                {user && (
                                    <button onClick={() => setView('dashboard')} className="mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-brand-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                        <Briefcase size={14} /> View My Builds
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {view === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                                className="flex-1 flex flex-col p-8 pt-20"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-2xl font-bold text-slate-900">My Builds</h2>
                                    <button onClick={() => { Storage.logout(); setUser(null); setView('landing'); }} className="text-slate-300 hover:text-red-400">
                                        <LogOut size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                                    {projects.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                            <p className="text-slate-400 font-medium">No builds yet.</p>
                                            <button onClick={() => setView('landing')} className="text-brand-500 font-bold text-sm mt-2 underline">Start building</button>
                                        </div>
                                    ) : (
                                        projects.map(p => (
                                            <div key={p.id} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-300 transition-all shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                                                    <button onClick={() => handleDelete(p.id)} className="text-slate-200 hover:text-red-400 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
                                                    <button onClick={() => { setBlueprint(p); setView('editor'); }} className="bg-brand-50 text-brand-600 px-4 py-2 rounded-full hover:bg-brand-300 hover:text-brand-900 transition-all">Open Project</button>
                                                    <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Button onClick={() => setView('landing')} className="mt-8 rounded-2xl w-full py-4 text-xs tracking-widest uppercase">New Build</Button>
                            </motion.div>
                        )}

                        {view === 'editor' && (
                            <motion.div
                                key="editor"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                                    <button onClick={() => setView('dashboard')} className="p-2 hover:bg-brand-50 rounded-xl transition-colors text-slate-400 hover:text-brand-600">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <h3 className="font-bold text-slate-900 tracking-tight">Project Editor</h3>
                                    <button onClick={handleSave} className="p-2 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-300 hover:text-brand-900 transition-all">
                                        <Save size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
                                    <div className="bg-brand-50 rounded-[2rem] p-6 border border-brand-100">
                                        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-2">Blueprint Concept</p>
                                        <input
                                            type="text"
                                            value={blueprint?.name}
                                            onChange={(e) => updateBlueprint('name', e.target.value)}
                                            className="text-2xl font-bold text-slate-900 bg-transparent border-none p-0 outline-none w-full"
                                        />
                                    </div>

                                    <EditorSection title="Navigation" icon={<Layout size={18} />} items={blueprint.pages} onUpdate={(val) => updateBlueprint('pages', val)} />
                                    <EditorSection title="Capabilities" icon={<Smartphone size={18} />} items={blueprint.features} />

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Palette size={18} /></div>
                                            <h5 className="font-bold text-slate-900 leading-none">Design System</h5>
                                        </div>
                                        <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                                            <span className="font-semibold text-slate-600 text-sm">Accent Color</span>
                                            <input
                                                type="color"
                                                value={blueprint.style.primaryColor}
                                                onChange={(e) => updateBlueprint('style', { ...blueprint.style, primaryColor: e.target.value })}
                                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 pb-24 text-center">
                                        <button className="flex items-center justify-center gap-2 mx-auto text-brand-400 hover:text-brand-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
                                            <Share2 size={12} /> Share Public Preview
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-0">
                        <span className="text-[10px] font-bold text-slate-200 tracking-[0.2em]">BUILT WITH ROB THE BUILDER</span>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center justify-center p-10 sticky top-0 h-screen">
                    {blueprint && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-[320px] w-full">
                            <div className="mb-8 text-center flex flex-col gap-2">
                                <span className="text-xs font-bold text-brand-400 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100 uppercase tracking-widest inline-block mx-auto">Live Mobile Preview</span>
                                <p className="text-[10px] text-slate-300 font-bold tracking-tighter">DETERMINISTIC BLUEPRINT RENDERING</p>
                            </div>
                            <Preview blueprint={blueprint} />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditorSection({ title, icon, items }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">{icon}</div>
                <h5 className="font-bold text-slate-900 leading-none">{title}</h5>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {items.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm group hover:border-brand-200 transition-all cursor-pointer">
                        <span className="font-semibold text-slate-600 text-sm">{item.name}</span>
                        <div className={`w-10 h-6 ${item.enabled !== false ? 'bg-brand-300' : 'bg-slate-100'} rounded-full relative transition-colors`}>
                            <div className={`absolute top-1 ${item.enabled !== false ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full shadow-md transition-all`} />
                        </div>
                    </div>
                ))}
                <button className="text-[11px] font-bold text-brand-500 bg-brand-50/30 p-4 rounded-2xl border border-dashed border-brand-100 hover:bg-brand-50 transition-all uppercase tracking-widest">+ Add {title.slice(0, -1)}</button>
            </div>
        </div>
    );
}
