import express from 'express';
import { setRoutes } from './routes';
import { setMiddlewaresAfterRoutes, setMiddlewaresBeforeRoutes } from './middlewares';
import { TenantConnectionService } from './services/tenantConnection.service';
require('dotenv').config();

const app = express();

//Define os middlewares da applicação que operam antes de ir para as rotas
setMiddlewaresBeforeRoutes(app);

//Define as rotas da aplicação
setRoutes(app);

//Degine os middlewares da aplicação que operam após as rotas
setMiddlewaresAfterRoutes(app);

/**
 * Armazena todas as instâncias de conexão com banco de dados
 */
export const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

//TODO colocar o cache aqui também

export default app;
