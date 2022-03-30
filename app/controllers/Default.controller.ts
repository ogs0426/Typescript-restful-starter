import * as express from "express";

export class DefaultController {

    public static async Get(req: express.Request, res: express.Response) {
        return res.status(200).send({process: process.pid, text: "OK"});
    }
}
