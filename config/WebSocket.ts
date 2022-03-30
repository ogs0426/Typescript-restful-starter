import { Server } from "socket.io";
import { createClient } from 'redis';
import * as http from "http";
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from "./Redis";

export class WebSocket {

  private readonly wss : Server;

  constructor(http : http.Server) {
    
    this.wss = new Server(http, {
      transports: ['websocket'],
      allowEIO3: true,
      path: "/",
    });

  }

  public Http(): Server {
    return this.wss;
  }

  public Start(): Promise<Server> {
    
    console.log(`${process.pid} : WebSocket Server Start`);

    this.OnEvent();
  
    return Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this.wss.adapter(createAdapter(pubClient, subClient));
      this.wss.sockets.setMaxListeners(0);
      return this.wss;
    });
  }
  
  private OnEvent(): void {

    this.wss.on("connect", (socket) => {
      console.log(`${process.pid} : connect ${socket.id}`);

      
      //socket.emit('client', {cmd: 100, userId: userId, d: 'web'});
  
      socket.on("ping", (cb) => {
          console.log("ping");
          cb();
      });
    
      socket.on("message", (msg) => {
          console.log("message" + msg);
      });
      
      socket.on("client", (msg) => {
          console.log("client" + JSON.stringify(msg));
          socket.emit("message", "hihi");
      });

      socket.on("disconnect", () => {
          console.log(`disconnect ${socket.id}`);
      });
    });

  }

};