/**
 * Virtual File System (VFS) for Rob IDE
 * Creates a clean React structure for the sandbox.
 */

export const createInitialWorkspace = (description, blueprint) => {
  const primaryColor = blueprint.style.primaryColor || '#7EDBFF';
  const name = blueprint.name || 'My App';

  return {
    id: blueprint.id,
    name: name,
    description: description,
    files: {
      'App.jsx': `
const App = () => {
  return (
    <div className="p-8 min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm">
        <Icons.Sparkles size={32} />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">${name}</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
          ${description.replace(/"/g, "'")}
        </p>
      </div>

      <div className="w-full max-w-[240px] h-[1px] bg-slate-200" />

      <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
        ${blueprint.pages.map(p => `
          <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center gap-2 shadow-sm">
            <div className="text-blue-500/50"><Icons.Circle size={12} /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${p.name}</span>
          </div>
        `).join('')}
      </div>

      <div className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200">
        Launch Experience
      </div>
    </div>
  );
};
`,
      'styles.css': `
:root { --brand: ${primaryColor}; }
body { -webkit-font-smoothing: antialiased; }
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
