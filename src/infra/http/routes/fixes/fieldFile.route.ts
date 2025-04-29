import { Application, Router } from 'express';
import { FieldFileController } from '../../controllers/fixes/fieldFile.controller';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import validateHeaders from '../../validators/fixes/index.validator';

export default function defineRoute(app: Application) {
  const controller: FieldFileController = new FieldFileController();
  const router: Router = Router();
  // Create a new FieldFile 
  router.post('/', [checkUserAccess, validateHeaders], controller.create);

  // Retrieve all estrutura_orcamento 
  router.get('/', [checkUserAccess, validateHeaders], controller.findAll);
  // Retrieve cout estrutura_orcamento
  router.get('/count', [checkUserAccess], controller.getCount);
  // Retrieve a single FieldFile with id 
  router.get('/:id', [checkUserAccess], controller.findById);
  // Update a FieldFile with id 
  router.put('/:id', [checkUserAccess], controller.update);
  // Delete a FieldFile with id 
  router.delete('/:id', [checkUserAccess], controller.delete);
  // Custom get FieldFile 
  router.post("/custom", [checkUserAccess], controller.customQuery);
  // Upload a file
  router.post("/upload", [checkUserAccess], controller.upload);

  app.use('/api/field-file', router);
}; 
