import { Application, Router } from "express";
import { ComponentStructureController } from "../../controllers/fixes/componentStructure.controller";
import { checkUserAccess } from "../../middlewares/checkUserAccess.middleware";
import { getPageStructureValidator } from "../../validators/fixes/componentStructure.validators";
import validateHeaders from "../../validators/fixes/index.validator";

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application) {
  const controller: ComponentStructureController = new ComponentStructureController();
  const router: Router = Router();

  router.post('/', [checkUserAccess, ...getPageStructureValidator, validateHeaders], controller.findOne);

  app.use('/api/component-structure', router);
} 
