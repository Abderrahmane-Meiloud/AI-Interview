// Vercel serverless entry point. Vercel invokes the default export of any
// file under /api as a request handler — it does not run server.js (which
// calls app.listen(), meaningless in a serverless runtime). This module
// reuses the same Express app and routes, only swapping the transport:
// connectDB() is awaited per-request instead of once at startup, relying on
// the connection cache in server/config/db.js so warm invocations reuse the
// existing MongoDB connection instead of opening a new one each time.
import app from '../server/app.js';
import connectDB from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    let serverErrors = 'n/a';
    try {
      const servers = error?.reason?.servers;
      if (servers instanceof Map) {
        serverErrors = JSON.stringify(
          [...servers.entries()].map(([addr, desc]) => ({
            addr,
            type: desc.type,
            error: desc.error ? { name: desc.error.name, message: desc.error.message, code: desc.error.code } : undefined,
          }))
        );
      }
    } catch {
      serverErrors = 'failed to extract';
    }
    console.error(
      `[api] MongoDB connection failed: ${error.message} | name: ${error.name} | servers: ${serverErrors}`
    );
    res.status(503).json({ message: 'Service temporarily unavailable. Please try again shortly.' });
    return;
  }
  app(req, res);
}
