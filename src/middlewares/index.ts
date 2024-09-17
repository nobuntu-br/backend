import cors, { CorsOptions }  from "cors";
import { Application } from "express";
import express from 'express';
import { errorHandler } from "./errorHandler.middleware";

export default function setMiddlewares(app: Application){

  var corsOptions : CorsOptions = {
    origin: "*"
  };
  
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  app.use(errorHandler);
}
