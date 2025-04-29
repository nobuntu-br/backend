import { Application, Router } from 'express';
import { FileController } from '../../controllers/fixes/file.controller';
import { checkUserAccess } from '../../middlewares/checkUserAccess.middleware';
import validateHeaders from '../../validators/fixes/index.validator';


export default function defineRoute(app: Application) {
  const controller: FileController = new FileController();
  const router: Router = Router();
  // Create a new File 
  router.post('/', [checkUserAccess, validateHeaders], controller.create);
  // Retrieve all estrutura_orcamento 
  router.get('/', [checkUserAccess, validateHeaders], controller.findAll);
  // Retrieve cout estrutura_orcamento
  router.get('/count', [checkUserAccess], controller.getCount);
  // Retrieve a single File with id 
  router.get('/:id', [checkUserAccess], controller.findById);
  // Update a File with id 
  router.put('/:id', [checkUserAccess], controller.update);
  // Delete a File with id 
  router.delete('/:id', [checkUserAccess], controller.delete);
  // Custom get File 
  router.post("/custom", [checkUserAccess], controller.customQuery);

  app.use('/api/file', router);
}; 
