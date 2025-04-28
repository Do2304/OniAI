import { Express } from "express";
import { UserRoutes } from "./userRoute";

const main = (app: Express) => {
  app.use("/v1", UserRoutes);
};

export default main;