/**
 * Virtual File System (VFS) for Rob IDE
 * Injects a fully functional, multi-page layout based on prompt.
 */

export const createInitialWorkspace = (description, blueprint) => {
  const name = blueprint.name || 'My App';
  const color = blueprint.style.primaryColor || '#3b82f6';

  return {
    id: blueprint.id,
    name: name,
    description: description,
    files: {
      'App.jsx': `
const App = () => {
  const [activeTab, setActiveTab] = React.useState('home');
  const [items, setItems] = React.useState([]);

  const pages = [
    { id: 'home', name: 'Home', icon: 'Home' },
    { id: 'explore', name: 'Explore', icon: 'Search' },
    ${blueprint.pages.map(p => `{ id: '${p.id}', name: '${p.name}', icon: 'Layers' }`).join(',\n    ')}
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-8 flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">${name}</h1>
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <Icons.Sparkles size={20} />
            </div>
        </div>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
            ${description.replace(/"/g, "'").slice(0, 60)}...
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 pb-24">
         <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</span>
                </div>
                <h3 className="text-lg font-bold">Ready for Action</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Use the navigation below to explore your new functional application.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {pages.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setActiveTab(p.id)}
                    className="p-5 bg-white border border-slate-100 rounded-3xl flex flex-col gap-3 hover:border-blue-500 transition-all shadow-sm"
                  >
                     <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Icons.Circle size={16} />
                     </div>
                     <span className="font-bold text-xs text-slate-700">{p.name}</span>
                  </button>
                ))}
            </div>
         </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-6 flex justify-between items-center z-50">
           {pages.slice(0, 4).map(p => (
             <button key={p.id} onClick={() => setActiveTab(p.id)} className={activeTab === p.id ? 'text-blue-500' : 'text-slate-300'}>
                <Icons.Circle size={20} fill={activeTab === p.id ? 'currentColor' : 'none'} />
             </button>
           ))}
      </nav>
    </div>
  );
};
`
    },
    updatedAt: new Date().toISOString()
  };
};

export const updateFile = (workspace, filename, content) => {
  return {
    ...workspace,
    files: { ...workspace.files, [filename]: content },
    updatedAt: new Date().toISOString()
  };
};
