import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ttf': 'font/ttf', '.md': 'text/plain; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${host}:${port}`);
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    let target = resolve(root, relative);
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403); response.end('Acceso no permitido'); return;
    }
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    const bytes = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(bytes);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Página no encontrada');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Huevos Co. está listo en http://${host}:${port}`));
