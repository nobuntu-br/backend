import express from 'express';
import { setRoutes } from './infra/http/routes';
import { setMiddlewaresAfterRoutes, setMiddlewaresBeforeRoutes } from './infra/http/middlewares';
import { TenantConnectionService } from './domain/services/tenantConnection.service';
require('dotenv').config();

const app = express();

//Define os middlewares da applicação que operam antes de ir para as rotas
setMiddlewaresBeforeRoutes(app);

//Define as rotas da aplicação
setRoutes(app);

//Degine os middlewares da aplicação que operam após as rotas
setMiddlewaresAfterRoutes(app);

/**
 * Instancia classe que Armazena todas as instâncias de conexão com banco de dados
 */
export const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

export default app;
