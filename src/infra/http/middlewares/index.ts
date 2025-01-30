import cors, { CorsOptions }  from "cors";
import { Application } from "express";
import express from 'express';
import { errorHandler } from "./errorHandler.middleware";
var cookieParser = require('cookie-parser')

export function setMiddlewaresBeforeRoutes(app: Application){

  var corsOptions : CorsOptions = {
    // origin: "*",
    origin: process.env.FRONTEND_PATH, // URL do frontend
    credentials: true, // Permite envio de cookies
  };
  
  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

}

export function setMiddlewaresAfterRoutes(app: Application){
  app.use(errorHandler);
}