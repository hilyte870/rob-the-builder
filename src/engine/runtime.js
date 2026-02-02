/**
 * Rob IDE Runtime Service
 * Handles in-browser transpilation and execution of React code.
 */

// We use an Iframe sandbox to isolate the preview.
// The runtime injects the necessary libraries (React, Tailwind, Lucide) via CDN.
export const generateSandboxHtml = (vfs) => {
    const { files } = vfs;

    // Minimal React Environment for the Iframe
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      ${files['styles.css'] || ''}
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" data-presets="react">
      // Basic Mock for Lucide React
      const { ${Object.keys(require('lucide-react')).filter(k => k !== 'default').join(', ')} } = Lucide;
      
      const { useState, useEffect, useMemo, useCallback } = React;
      
      ${files['App.jsx']}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    </script>
  </body>
</html>
  `;
};
