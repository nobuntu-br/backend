import { Application, Router } from 'express';
import { verifyAccess } from '../middlewares/auth.middleware'; 
import getUserTenant from '../middlewares/tenant.middleware'; 
import validateHeaders from './validators/index.validator';
import { FileController } from '../controllers/file.controller';

export default function defineRoute(app: Application){ 
  const controller : FileController= new FileController(); 
  const router: Router = Router(); 
    // Create a new File 
  router.post('/', [verifyAccess, getUserTenant, validateHeaders] ,controller.create);

    // Retrieve all estrutura_orcamento 
  router.get('/', [verifyAccess, getUserTenant, validateHeaders], controller.findAll); 
    // Retrieve cout estrutura_orcamento
  router.get('/count', [verifyAccess, getUserTenant], controller.getCount); 
    // Retrieve a single File with id 
  router.get('/:id', [verifyAccess, getUserTenant], controller.findById); 
    // Update a File with id 
  router.put('/:id', [verifyAccess, getUserTenant], controller.update); 
    // Delete a File with id 
  router.delete('/:id', [verifyAccess, getUserTenant], controller.delete); 
    // Custom get File 
    router.post("/custom", [verifyAccess, getUserTenant], controller.customQuery);

    app.use('/api/file', router); 
  }; 
