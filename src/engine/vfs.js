/**
 * Virtual File System (VFS) for Rob IDE v3.4
 * Generates HTM-compatible React code for guaranteed runtime execution.
 */

export const createInitialWorkspace = (description, blueprint) => {
  const name = blueprint.name || 'My App';

  return {
    id: blueprint.id,
    name: name,
    description: description,
    files: {
      'App.jsx': `
const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Feed' },
    { id: 'explore', label: 'Explore' },
    { id: 'profile', label: 'Profile' }
  ];

  return html\`
    <div className="flex flex-col h-screen bg-white">
      <header className="px-8 py-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">${name}</h1>
            <div className="w-12 h-12 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                <\${Icons.Sparkles} size=\${24} />
            </div>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Personal Builder Active
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-8">
         <div className="space-y-6">
            <div className="p-8 bg-slate-900 rounded-[2.5rem] flex flex-col gap-4 shadow-2xl shadow-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Core</span>
                </div>
                <h3 className="text-xl font-bold text-white capitalize">${description.replace(/"/g, "'").slice(0, 40)}...</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium capitalize">Building functional logic for your request. Navigation is live.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:bg-white transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                      <\${Icons.Rocket} size=\${20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Get Started</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Setup Wizard</p>
                    </div>
                  </div>
                  <\${Icons.ChevronRight} size=\${16} className="text-slate-300" />
               </div>
            </div>
         </div>
      </main>

      <nav className="px-10 py-8 bg-white/80 backdrop-blur-2xl flex justify-between items-center border-t border-slate-50">
        \${navItems.map(item => html\`
           <button 
            key=\${item.id}
            onClick=\${() => setActiveTab(item.id)}
            className=\${activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-300'}
            style=\${{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
           >
              <\${Icons.Circle} size=\${24} fill=\${activeTab === item.id ? 'currentColor' : 'none'} />
           </button>
        \`)}
      </nav>
    </div>
  \`;
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
