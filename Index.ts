import * as cluster from "cluster";
import { cpus } from "os";
import { config, isProduction, getProduction } from "./config";
import { Server } from "./config/Server";
import { WebSocket } from "./config/WebSocket";


// Master Process Check 
// [ohgyu] pm2 와 같은 pm으로 관리 할 경우 fork 모드를 사용 하여 모듈을 관리 할것
if (cluster.isMaster) {

    console.log(`\n -------------------> RUN ${getProduction()} ENVIRONMENT \n`);
    
    if (isProduction()) {
        for (const _ of cpus()) {
            cluster.fork();
        }
    } else {
        for (const _ of [1]) {
            cluster.fork();
        }
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log("Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal);
        console.log("Starting a new worker");
        // Server Alert notify
        cluster.fork();
    });

} else {

    const port: number = Number(config.PORT_APP);

    new Server().Start().then((server) => {
        new WebSocket(server).Start();

        server.listen(port, () => {
    
            console.log(`Server is running in process ${process.pid} listening on PORT ${port} \n`);
        });

    });
}

