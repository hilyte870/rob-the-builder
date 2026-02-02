import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, Smartphone, Layout, Palette, Shield,
    CreditCard, ChevronLeft, Loader2, Share2, Save, LogOut,
    Briefcase, Trash2, Code, Terminal, FileCode, CheckCircle2,
    ChevronRight, Play
} from 'lucide-react';

// Engine Imports
import { interpretPrompt } from './engine/ai';
import * as Storage from './engine/storage';
import { updateFile } from './engine/vfs';

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
    const [view, setView] = useState('landing');
    const [user, setUser] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [workspace, setWorkspace] = useState(null);
    const [isBuilding, setIsBuilding] = useState(false);
    const [projects, setProjects] = useState([]);

    // IDE State
    const [activeFile, setActiveFile] = useState('App.jsx');
    const [showCode, setShowCode] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const session = Storage.getSession();
        if (session) setUser(session);
        setProjects(Storage.getProjects());
    }, []);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { id: Date.now(), msg, type, time: new Date().toLocaleTimeString() }].slice(-5));
    };

    const handleLogin = () => {
        const email = prompt || 'user@example.com';
        Storage.loginUser(email);
        setUser({ email, isLoggedIn: true });
        setView('dashboard');
    };

    const handleBuild = async () => {
        if (!prompt.trim()) return;
        setIsBuilding(true);
        addLog('Analyzing request...', 'info');
        try {
            const generated = await interpretPrompt(prompt);
            setWorkspace(generated);
            setView('editor');
            addLog('Project workspace initialized.', 'success');
            addLog('Ready for launch.', 'success');
        } catch (err) {
            addLog('Error during generation.', 'error');
        } finally {
            setIsBuilding(false);
        }
    };

    const handleSave = () => {
        Storage.saveProject(workspace);
        setProjects(Storage.getProjects());
        addLog('Changes saved to cloud.', 'success');
    };

    const handleFileChange = (content) => {
        const updated = updateFile(workspace, activeFile, content);
        setWorkspace(updated);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 text-slate-900 overflow-hidden">
            <div className="max-w-[1440px] mx-auto min-h-screen relative flex flex-col md:flex-row items-center justify-center lg:gap-10">

                {/* Left Side: Mobile Core (Editor/Login/Dash) */}
                <div className="w-full max-w-[440px] bg-white h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-slate-100 z-10 shrink-0">

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
                                        <h1 className="text-2xl font-bold tracking-tight">Rob</h1>
                                        <p className="text-xs font-bold text-brand-500 uppercase tracking-[0.2em] text-left leading-none mt-1">THE BUILDER</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-4xl font-bold leading-tight">
                                        Build your vision with <span className="text-brand-300">professional</span> precision.
                                    </h2>
                                </div>

                                <div className="mt-12 space-y-4">
                                    <div className="relative group">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Describe the app you want to build..."
                                            className="w-full h-44 bg-slate-50 border-2 border-slate-100 focus:border-brand-300 rounded-[2rem] p-6 text-lg transition-all outline-none resize-none shadow-inner group-hover:bg-white"
                                        />
                                        <div className="absolute top-4 right-4 text-slate-200 pointer-events-none group-focus-within:text-brand-200 transition-colors">
                                            <Sparkles size={24} />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={user ? handleBuild : handleLogin}
                                        className="w-full text-xl py-6 rounded-[1.5rem] shadow-xl shadow-brand-100/50"
                                        disabled={!prompt.trim() || isBuilding}
                                        isLoading={isBuilding}
                                    >
                                        {user ? 'Build App' : 'Get Started'} <ArrowRight size={20} />
                                    </Button>
                                </div>

                                {user && (
                                    <button onClick={() => setView('dashboard')} className="mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-brand-600 font-bold text-[10px] uppercase tracking-widest transition-colors">
                                        <Briefcase size={12} /> View Personal Workspace
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
                                    <h2 className="text-2xl font-bold">Personal Builds</h2>
                                    <button onClick={() => { Storage.logout(); setUser(null); setView('landing'); }} className="p-2 text-slate-300 hover:text-red-400">
                                        <LogOut size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-premium">
                                    {projects.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                            <p className="text-slate-400 font-medium italic">No workspaces found.</p>
                                            <button onClick={() => setView('landing')} className="text-brand-500 font-bold text-xs mt-3 uppercase tracking-widest">New Build</button>
                                        </div>
                                    ) : (
                                        projects.map(p => (
                                            <div key={p.id} className="group p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-300 transition-all shadow-sm hover:shadow-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <button onClick={() => { setWorkspace(p); setView('editor'); }} className="bg-brand-50 text-brand-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-300 hover:text-brand-900 transition-all flex items-center gap-2">
                                                        <Play size={12} fill="currentColor" /> Resume Project
                                                    </button>
                                                    <span className="text-[10px] text-slate-300 font-bold">{new Date(p.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Button onClick={() => setView('landing')} className="mt-8 rounded-2xl w-full py-4 text-xs tracking-widest uppercase">Create New Build</Button>
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
                                    <div className="flex flex-col items-center">
                                        <span className="text-[9px] font-bold text-brand-500 uppercase tracking-widest leading-none mb-1">Live Workspace</span>
                                        <h3 className="font-bold text-slate-900 tracking-tight leading-none">{workspace?.name}</h3>
                                    </div>
                                    <button onClick={handleSave} className="p-2 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-300 hover:text-brand-900 transition-all">
                                        <Save size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col overflow-hidden">
                                    {/* IDE Toolbar */}
                                    <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
                                        <button
                                            onClick={() => setShowCode(false)}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${!showCode ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Interface
                                        </button>
                                        <button
                                            onClick={() => setShowCode(true)}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${showCode ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <div className="flex items-center justify-center gap-1.5"><Code size={12} /> Source</div>
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                                        {!showCode ? (
                                            <>
                                                <div className="bg-brand-50 rounded-[2rem] p-6 border border-brand-100 shadow-inner">
                                                    <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Terminal size={12} /> AI Strategy</p>
                                                    <p className="text-sm font-semibold text-brand-900 leading-relaxed italic">"{workspace.description}"</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between px-1">
                                                        <h5 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Workspace Files</h5>
                                                        <span className="text-[10px] text-slate-400 font-medium">3 ACTIVE</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.keys(workspace.files).map(file => (
                                                            <button
                                                                key={file}
                                                                onClick={() => { setActiveFile(file); setShowCode(true); }}
                                                                className="group p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:border-brand-300 transition-all"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-500 group-hover:bg-brand-50 transition-colors">
                                                                        <FileCode size={16} />
                                                                    </div>
                                                                    <span className="font-bold text-slate-600 text-xs">{file}</span>
                                                                </div>
                                                                <ChevronRight size={14} className="text-slate-200 group-hover:text-brand-400" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 px-1">
                                                        <h5 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Build Logs</h5>
                                                    </div>
                                                    <div className="bg-slate-900 rounded-[1.5rem] p-4 font-mono text-[10px] space-y-2 shadow-xl">
                                                        {logs.length === 0 ? (
                                                            <p className="text-slate-500 italic">No logs yet.</p>
                                                        ) : (
                                                            logs.map(log => (
                                                                <div key={log.id} className="flex gap-2">
                                                                    <span className="text-slate-600">[{log.time}]</span>
                                                                    <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-slate-300'}>
                                                                        {log.msg}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex flex-col gap-4">
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="flex items-center gap-2">
                                                        <FileCode size={14} className="text-brand-500" />
                                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{activeFile}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {Object.keys(workspace.files).map(name => (
                                                            <button
                                                                key={name}
                                                                onClick={() => setActiveFile(name)}
                                                                className={`w-2 h-2 rounded-full ${activeFile === name ? 'bg-brand-500' : 'bg-slate-200'} transition-all`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={workspace.files[activeFile]}
                                                    onChange={(e) => handleFileChange(e.target.value)}
                                                    spellCheck="false"
                                                    className="flex-1 w-full bg-slate-900 text-slate-100 p-6 rounded-[1.5rem] font-mono text-[11px] leading-relaxed outline-none border border-slate-800 shadow-2xl resize-none scrollbar-hide"
                                                />
                                                <p className="text-[10px] text-slate-400 italic text-center">AI: "I am syncing your structural changes to the live runtime..."</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-0">
                        <span className="text-[10px] font-bold text-slate-200 tracking-[0.2em] uppercase">Built with Rob IDE</span>
                    </div>
                </div>

                {/* Right Side: Professional Preview Hub */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-10 h-screen overflow-hidden">
                    {workspace && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-[340px] w-full flex flex-col items-center">
                            <div className="mb-8 text-center flex flex-col gap-2">
                                <div className="flex items-center gap-2 mx-auto px-4 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Active Runtime</span>
                                </div>
                                <p className="text-[10px] text-slate-300 font-bold tracking-tighter uppercase tracking-[0.3em]">Isolated Sandbox Environment</p>
                            </div>
                            <Preview workspace={workspace} isLoading={isBuilding} />

                            <div className="mt-8 w-full bg-white/50 backdrop-blur-md border border-white p-4 rounded-3xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                                        <Share2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Share Build</p>
                                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Public Preview Link</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-300" />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
