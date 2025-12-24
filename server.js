// Demo NodeJS server to test the library - REMOVE ON PRODUCTION

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load config to determine routing behavior
let config = null;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
} catch (err) {
  console.log('Config file not found or invalid, using default routing');
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // First check if the request is for a specific file (has extension)
  const extname = path.extname(pathname);
  if (extname) {
    // Handle file requests (JS, CSS, JSON, HTML files)
    const filePath = path.join(__dirname, pathname);
    let contentType = 'text/plain';

    if (extname === '.js') contentType = 'application/javascript';
    if (extname === '.css') contentType = 'text/css';
    if (extname === '.json') contentType = 'application/json';
    if (extname === '.html') contentType = 'text/html';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        // Serve 404.html for missing files
        serve404(res);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    });
  } else {
    // Check if we should handle language-specific URLs (only when config.recognize_language_by is 'url')
    const shouldHandleLanguageUrls = config && config.recognize_language_by === 'url';
    
    if (pathname === '/') {
      // Always serve demo.html for root path
      fs.readFile(path.join(__dirname, 'demo.html'), 'utf-8', (err, data) => {
        if (err) {
          serve404(res);
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
    } else if (shouldHandleLanguageUrls && (pathname.match(/^\/[a-z]{2}(\/.*)?$/))) {
      // Handle language-specific URLs only when config method is 'url'
      fs.readFile(path.join(__dirname, 'demo.html'), 'utf-8', (err, data) => {
        if (err) {
          serve404(res);
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
    } else {
      // Handle other paths without extensions - serve 404
      serve404(res);
    }
  }
});

// Function to serve 404.html
const serve404 = (res) => {
  fs.readFile(path.join(__dirname, '404.html'), 'utf-8', (err, data) => {
    if (err) {
      // If even 404.html is missing, serve plain text 404
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 - Page Not Found');
      return;
    }
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });
};

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Try accessing:');
  console.log('  http://localhost:3000/ (default)');
  console.log('  http://localhost:3000/en/ (English)');
  console.log('  http://localhost:3000/el/ (Greek)');
  console.log('  http://localhost:3000/?lang=en (URL parameter)');
});

