const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Serve the HTML file
    fs.readFile(path.join(__dirname, 'demo.html'), 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Server error');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    // Handle other requests (like JS, CSS files)
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/plain';

    if (extname === '.js') contentType = 'application/javascript';
    if (extname === '.css') contentType = 'text/css';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
