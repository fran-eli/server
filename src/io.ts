import { Server, Socket } from "socket.io";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    token: string;
}

export type IoServer = Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData
>;

export default (io: IoServer) => {
    io.on("connection", (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
