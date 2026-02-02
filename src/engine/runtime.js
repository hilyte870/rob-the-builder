/**
 * Rob IDE Runtime Service v3.2 (Fail-Safe)
 * Handles robust sandbox generation with advanced error reporting.
 */

const escapeHtml = (text) => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const generateSandboxHtml = (vfs) => {
  const { files, name, description } = vfs;

  // Sanitize inputs to prevent breaking the JS template
  const safeName = (name || "App").replace(/"/g, '\\"');
  const safeDesc = (description || "").replace(/"/g, '\\"');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview Sandbox</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; background: #fff; overflow-x: hidden; font-family: sans-serif; }
        #boot-screen {
            position: fixed; inset: 0; display: flex; flex-direction: column;
            align-items: center; justify-content: center; background: #f8fafc;
            color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase;
            letter-spacing: 0.1em; gap: 12px; z-index: 1000;
        }
        #error-overlay {
            position: fixed; inset: 0; background: #fff; color: #ef4444;
            padding: 32px; font-family: monospace; font-size: 13px;
            display: none; z-index: 2000; line-height: 1.6;
        }
        .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #7EDBFF; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="boot-screen">
        <div class="spinner"></div>
        <span>Constructing Canvas...</span>
    </div>
    <div id="error-overlay"></div>
    <div id="root"></div>

    <!-- Static Dependencies -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>

    <script type="text/babel" data-presets="react">
        const Icons = Lucide;
        const { useState, useEffect, useMemo, useCallback } = React;

        // SAFE EXECUTION WRAPPER
        (function() {
            const reportError = (type, err) => {
                const overlay = document.getElementById('error-overlay');
                document.getElementById('boot-screen').style.display = 'none';
                overlay.style.display = 'block';
                overlay.innerHTML = \`<div style="font-weight:bold;margin-bottom:12px;">\${type}</div> \${err}\`;
                console.error(err);
            };

            window.onerror = (msg) => reportError('RUNTIME ERROR', msg);

            try {
                // INJECT APP CODE
                ${files['App.jsx'] || 'const App = () => <div>No App Code Found</div>;'}

                const container = document.getElementById('root');
                const root = ReactDOM.createRoot(container);
                
                root.render(<App />);

                // SUCCESS: Remove boot screen
                setTimeout(() => {
                   document.getElementById('boot-screen').style.display = 'none';
                }, 200);

            } catch (err) {
                reportError('BUILD ERROR', err.message);
            }
        })();
    </script>
</body>
</html>
  `;
};
