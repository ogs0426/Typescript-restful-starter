import { createClient } from "redis";
import { config } from "../config";

export function isCluster(): Boolean {
    return config.REDIS.IS_CLUSTER;
}

export const pubClient = createClient({ url: config.REDIS.URL });

export const subClient = pubClient.duplicate();

//refs [createClient configuration] #1 : https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md
