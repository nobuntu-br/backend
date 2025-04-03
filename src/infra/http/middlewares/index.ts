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

  app.use((req, res, next) => {
    if (req.path.includes("xmlrpc")) {
      return res.status(403).json({ message: "Access denied!" });
    }
    next();
  });

}

export function setMiddlewaresAfterRoutes(app: Application){
  app.use(errorHandler);

  // CSP no cabeçário
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self';"
    );
    next();
  });
  
}