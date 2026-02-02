/**
 * Rob IDE Runtime Service v3.4 (ULTIMATE STABILITY)
 * Zero-Transpile Engine: Uses React + HTM for guaranteed execution.
 * No Babel required = No hanging.
 */

export const generateSandboxHtml = (vfs) => {
  const { files, name } = vfs;

  // Prepare the source code for injection
  // We wrap the code in a function to isolate scope.
  const appSource = files['App.jsx'] || 'const App = () => React.createElement("div", null, "No Code");';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; background: #fff; overflow-x: hidden; font-family: sans-serif; }
        #boot {
            position: fixed; inset: 0; background: #fff; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 12px; color: #94a3b8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em;
        }
        .dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: pulse 1s infinite alternate; }
        @keyframes pulse { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.1); } }
    </style>
</head>
<body>
    <div id="boot">
        <div class="dot"></div>
        <span>Syncing ${name || 'Runtime'}</span>
    </div>
    <div id="root"></div>

    <!-- Essential React Core -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/htm@3.1.1/dist/htm.umd.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <script>
        // Setup HTM (JSX-like behavior without transpilation)
        const html = htm.bind(React.createElement);
        const Icons = Lucide;
        const { useState, useEffect, useMemo, useCallback } = React;

        // Fail-safe reporting
        const fail = (err) => {
            document.getElementById('boot').innerHTML = \`<div style="color:#ef4444;padding:20px;text-align:center;"><b>CRITICAL FAILURE</b><br/>\${err}</div>\`;
        };

        try {
            // INJECTED CODE
            ${appSource}

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(App));
            
            // Clean boot
            setTimeout(() => {
                const boot = document.getElementById('boot');
                if (boot) boot.style.display = 'none';
            }, 300);
        } catch (err) {
            fail(err.message);
        }
    </script>
</body>
</html>
  `;
};
