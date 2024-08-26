import express from 'express';
import { setRoutes } from './routes';
import setMiddlewares from './middlewares';
require('dotenv').config();

const app = express();

//Define os middlewares da applicação
setMiddlewares(app);

//Define as rotas da aplicação
setRoutes(app);

export default app;
