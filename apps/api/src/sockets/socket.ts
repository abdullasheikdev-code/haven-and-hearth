import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let ioInstance: SocketIOServer | null = null;

export const initializeSocket = (server: HttpServer, allowedOrigin: string): SocketIOServer => {
  ioInstance = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    // Rooms can be joined by branch: e.g. "branch_123", or by role: "kitchen_123", "hotel_123"
    socket.on('join_branch', (branchId: string) => {
      socket.join(`branch_${branchId}`);
    });

    socket.on('join_kitchen', (branchId: string) => {
      socket.join(`kitchen_${branchId}`);
    });

    socket.on('join_hotel', (hotelId: string) => {
      socket.join(`hotel_${hotelId}`);
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return ioInstance;
};

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.IO has not been initialized yet.');
  }
  return ioInstance;
};

export const emitEvent = (room: string, eventName: string, data: any) => {
  if (ioInstance) {
    ioInstance.to(room).emit(eventName, data);
  }
};
