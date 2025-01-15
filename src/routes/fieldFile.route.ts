import { Application, Router } from 'express';
import getUserTenant from '../middlewares/tenant.middleware';
import validateHeaders from './validators/index.validator';
import { FieldFileController } from '../controllers/fieldFile.controller';
import { checkUserAccess } from '../middlewares/checkUserAccess.middleware';

export default function defineRoute(app: Application) {
  const controller: FieldFileController = new FieldFileController();
  const router: Router = Router();
  // Create a new FieldFile 
  router.post('/', [checkUserAccess, getUserTenant, validateHeaders], controller.create);

  // Retrieve all estrutura_orcamento 
  router.get('/', [checkUserAccess, getUserTenant, validateHeaders], controller.findAll);
  // Retrieve cout estrutura_orcamento
  router.get('/count', [checkUserAccess, getUserTenant], controller.getCount);
  // Retrieve a single FieldFile with id 
  router.get('/:id', [checkUserAccess, getUserTenant], controller.findById);
  // Update a FieldFile with id 
  router.put('/:id', [checkUserAccess, getUserTenant], controller.update);
  // Delete a FieldFile with id 
  router.delete('/:id', [checkUserAccess, getUserTenant], controller.delete);
  // Custom get FieldFile 
  router.post("/custom", [checkUserAccess, getUserTenant], controller.customQuery);
  // Upload a file
  router.post("/upload", [checkUserAccess, getUserTenant], controller.upload);

  app.use('/api/field-file', router);
}; 
