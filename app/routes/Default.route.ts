import * as express from "express";
import { DefaultController } from "../controllers/Default.controller";

export const DefaultRoute: express.Router = express.Router()
    .get("/", DefaultController.Get);
