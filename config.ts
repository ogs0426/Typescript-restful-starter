import { env } from "process";

export const DIALECT = "mysql";

// TEST Settting
const LOCAL_DB_CONFIGURATION = {
	DB: "local_websock",
	SERVER: "localhost",
	PORT_DB: 3306,
	USER_DB: "root",
	PASSWORD: "1234",
};

// TEST Settting
const LOCAL_REDIS_CONFIGURATION = {
	URL : "redis://localhost:32768",
	IS_CLUSTER : false,
	HOST : "localhost",
	PORT : 32768,
};

// 환경별 env 설정을 따라 갈것
const PRODUCTION_DB_CONFIGURATION = {
    DB: env.DB,
    SERVER: env.SERVER,
    PORT_DB: Number(env.PORT_DB),
    USER_DB: env.USER_DB,
    PASSWORD: env.PASSWORD,
};

// 환경별 env 설정을 따라 갈것
const PRODUCTION_REDIS_CONFIGURATION = {
	URL : "redis://localhost:32768",
	IS_CLUSTER : true,
	HOST : "localhost",
	PORT : 6378,
};

export function isProduction(): boolean {
    return env.NODE_ENV === "PRODUCTION";
}

export function getProduction(): String {
    return env.NODE_ENV;
}

export const config = {
    DATABASE: isProduction() ? PRODUCTION_DB_CONFIGURATION : LOCAL_DB_CONFIGURATION,
    REDIS: isProduction() ? PRODUCTION_REDIS_CONFIGURATION : LOCAL_REDIS_CONFIGURATION,
    PORT_APP: 3030,
    SECRET: env.SECRET,
};
