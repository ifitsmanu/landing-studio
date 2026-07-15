import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const fixtureHtml = readFileSync(join(directory, 'index.html'));

export async function startFixtureServer() {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://fixture.test');
    response.setHeader('Cache-Control', 'no-store');

    if (url.pathname === '/api/cta' && request.method === 'POST') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: true, message: 'Fixture demo requested' }));
      return;
    }
    if (url.pathname === '/api/intentional-failure') {
      response.writeHead(503, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: false, intentional: true }));
      return;
    }
    if (url.pathname === '/' || url.pathname === '/index.html') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(fixtureHtml);
      return;
    }

    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}
