import { Application, Router } from "express";
import { ComponentStructureController } from "../controllers/componentStructure.controller";
import validateHeaders from "./validators/index.validator";
import { getPageStructureValidator } from "./validators/componentStructure.validators";
import getUserTenant from "../middlewares/tenant.middleware";

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: ComponentStructureController = new ComponentStructureController();
  const router: Router = Router();

  router.post('/', [getUserTenant, ...getPageStructureValidator, validateHeaders], controller.findOne);

  app.use('/api/component-structure', router);
} 
