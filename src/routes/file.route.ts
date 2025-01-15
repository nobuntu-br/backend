import { Application, Router } from 'express';
import getUserTenant from '../middlewares/tenant.middleware';
import validateHeaders from './validators/index.validator';
import { FileController } from '../controllers/file.controller';
import { checkUserAccess } from '../middlewares/checkUserAccess.middleware';

export default function defineRoute(app: Application) {
  const controller: FileController = new FileController();
  const router: Router = Router();
  // Create a new File 
  router.post('/', [checkUserAccess, getUserTenant, validateHeaders], controller.create);
  // Retrieve all estrutura_orcamento 
  router.get('/', [checkUserAccess, getUserTenant, validateHeaders], controller.findAll);
  // Retrieve cout estrutura_orcamento
  router.get('/count', [checkUserAccess, getUserTenant], controller.getCount);
  // Retrieve a single File with id 
  router.get('/:id', [checkUserAccess, getUserTenant], controller.findById);
  // Update a File with id 
  router.put('/:id', [checkUserAccess, getUserTenant], controller.update);
  // Delete a File with id 
  router.delete('/:id', [checkUserAccess, getUserTenant], controller.delete);
  // Custom get File 
  router.post("/custom", [checkUserAccess, getUserTenant], controller.customQuery);

  app.use('/api/file', router);
}; 
