import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: any) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected: ", socket.id);

      // Listen for voting events
      socket.on("vote", (data) => {
        // Broadcast to all connected users
        io?.emit("updateVote", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
      });
    });
  }
}

export function getSocket() {
  return io;
}
