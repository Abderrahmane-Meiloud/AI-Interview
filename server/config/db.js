import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// mongodb+srv:// URIs (used by Atlas) require a DNS SRV record lookup before
// connecting. Node's resolver can be pointed at a local forwarder (e.g. by a
// VPN or router) that answers normal A/AAAA queries but refuses SRV queries,
// causing "querySrv ECONNREFUSED" even though the URI/credentials are
// correct and the OS-level resolver works fine. Falling back to public
// resolvers only for SRV URIs avoids that class of failure without
// affecting non-Atlas (mongodb://) connections.
if (process.env.MONGO_URI?.startsWith('mongodb+srv://')) {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
}

// Reuses a single connection (or in-flight connection promise) across
// invocations. In a serverless runtime (e.g. Vercel) the module scope
// persists across warm invocations of the same function instance, so
// without this every request could open a new MongoDB connection and
// exhaust the connection limit; this cache makes warm invocations reuse
// the existing connection instead of reconnecting.
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectionPromise) {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview_coach';
    // Node 17+ resolves DNS as IPv6-first by default, which is a known
    // source of Atlas connection failures on some serverless networks.
    // Forcing IPv4 rules that class of issue out; Atlas is fully reachable
    // over IPv4, so this has no functional downside either way.
    connectionPromise = mongoose
      .connect(mongoURI, { family: 4 })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
};

export default connectDB;
