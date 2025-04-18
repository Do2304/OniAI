import { Express } from "express";
import { UserRoutes } from "./userRoute";

const main = (app: Express) => {
  app.use("/users", UserRoutes);
};

export default main;