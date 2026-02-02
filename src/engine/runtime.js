/**
 * Rob IDE Runtime Service v3.3 (Pro-Level Generation)
 * Handles in-browser transpilation and execution with high reliability.
 */

export const generateSandboxHtml = (vfs) => {
  const { files, name } = vfs;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; background: #fff; overflow-x: hidden; font-family: sans-serif; }
        ::-webkit-scrollbar { display: none; }
        #loading-overlay {
            position: fixed; inset: 0; background: #fff; display: flex;
            flex-direction: column; align-items: center; justify-content: center;
            z-index: 9999; gap: 15px; transition: opacity 0.5s ease;
        }
        .spinner { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="loading-overlay">
        <div class="spinner"></div>
        <div style="font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase;">Booting ${name || 'App'}</div>
    </div>
    <div id="root"></div>

    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <script type="text/babel">
        // Global dependencies
        window.Icons = Lucide;
        const { useState, useEffect, useMemo, useCallback } = React;

        try {
            // THE APP SOURCE
            ${files['App.jsx']}

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<App />);
            
            // Fade out loader once React is ready
            setTimeout(() => {
                const loader = document.getElementById('loading-overlay');
                if (loader) loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 500);
        } catch (err) {
            console.error('Build Error:', err);
            document.getElementById('loading-overlay').innerHTML = \`
                <div style="color: #ef4444; font-family: monospace; font-size: 12px; padding: 30px; text-align: center;">
                    <b>BUILD ERROR</b><br/>\${err.message}
                </div>
            \`;
        }
    </script>
</body>
</html>
  `;
};
