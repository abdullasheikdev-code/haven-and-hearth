import http from 'http';
import { createApp } from './app';
import { connectDB, disconnectDB } from './config/db';
import { initializeSocket } from './sockets/socket';
import { env } from './config/env';

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();
    const server = http.createServer(app);

    initializeSocket(server, env.CLIENT_URL);

    server.listen(env.PORT, () => {
      console.log(`===================================================`);
      console.log(`  Haven & Hearth Hospitality API Engine`);
      console.log(`  Running on: http://localhost:${env.PORT}`);
      console.log(`  API Base:   http://localhost:${env.PORT}/api/v1`);
      console.log(`  Health:     http://localhost:${env.PORT}/api/v1/health`);
      console.log(`===================================================`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Graceful shutdown initiated...');
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Shutdown complete.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
};

startServer();
