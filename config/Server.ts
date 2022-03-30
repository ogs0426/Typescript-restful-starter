import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as methodOverride from "method-override";
import * as morgan from "morgan";
import { Connection } from "./Database";
import { ROUTER } from "./Router";
import { WebSocket } from "./WebSocket";

export class Server {
    private static ConnectDB(): Promise<any> {
        return Connection;
    }
    
    private readonly app: express.Application;
    private readonly server: http.Server;
    //private readonly wss: WebSocket;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        //this.wss = new WebSocket(this.server);
    }

    public Start(): Promise<http.Server> {
        
        console.log(`${process.pid} : Http Server Start`);

        return Server.ConnectDB().then(() => {
            this.ExpressConfiguration();
            this.ConfigurationRouter();
            this.OnEvent();
            return this.server;
        });
    }
    
    public App(): express.Application {
        return this.app;
    }

    public Http(): http.Server {
        return this.server;
    }

    private ExpressConfiguration(): void {

        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use(methodOverride());

        this.app.use((req, res, next): void => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
            res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
            next();
        });

        this.app.use(morgan("combined"));
        this.app.use(cors());

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            err.status = 404;
            next(err);
        });
    }

    private ConfigurationRouter(): void {

        for (const route of ROUTER) {
            this.app.use(route.path, route.middleware, route.handler);
        }

        // Router_Next Not found 404
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.status(404);
            res.json({
                error: "Not found",
            });
            next();
        });

        // Router_Err_Next Unauthorized 401
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (err.name === "UnauthorizedError") {
                res.status(401).json({
                    error: "Please send a valid Token...",
                });
            }

            next();
        });

        // Router_Err_Next Server Unknow 500
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
            res.status(err.status || 500);
            res.json({
                error: err.message,
            });
            next();
        });
    }

    private OnEvent(): void {

        this.server.on("error", (error: any) => {
            if (error.syscall !== "listen") {
                console.log("syscall listen" + error);
                throw error;
            }

            switch (error.code) {
                case "EACCES":           // user permission
                    console.error("Port requires elevated privileges");
                    process.exit(1);
                    break;

                case "EADDRINUSE":       // used port session
                    console.error("Port is already in use");
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        this.server.on("listening", () => {
            console.log("http listen start");
        });
    }


}
