/**
 * Rob IDE Runtime Service (Fixed)
 * Handles in-browser transpilation and execution of React code.
 */

export const generateSandboxHtml = (vfs) => {
  const { files } = vfs;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      ${files['styles.css'] || ''}
      body { margin: 0; padding: 0; overflow-x: hidden; }
      #error-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        bg-color: #fff; padding: 20px; display: none; z-index: 9999;
        font-family: monospace; color: #e11d48;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <div id="error-overlay"></div>
    
    <script type="text/babel">
      // Robust Icon Provider
      const Icons = Lucide;
      
      // Error Handling Bridge
      window.onerror = function(message, source, lineno, colno, error) {
        const overlay = document.getElementById('error-overlay');
        overlay.style.display = 'block';
        overlay.innerHTML = '<b>Runtime Error:</b><br/>' + message;
        return true;
      };

      try {
        const { useState, useEffect, useMemo, useCallback } = React;
        
        // Inject files into the local scope
        ${files['App.jsx']}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      } catch (err) {
        const overlay = document.getElementById('error-overlay');
        overlay.style.display = 'block';
        overlay.innerHTML = '<b>Compilation Error:</b><br/>' + err.message;
      }
    </script>
  </body>
</html>
  `;
};
