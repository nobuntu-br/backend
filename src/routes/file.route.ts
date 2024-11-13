import { Application, Router } from 'express';
import { verifyAccess } from '../middlewares/auth.middleware'; 
import changeTenant from '../middlewares/tenant.middleware'; 
import validateHeaders from './validators/index.validator';
import { FileController } from '../controllers/file.controller';

export default function defineRoute(app: Application){ 
  const controller : FileController= new FileController(); 
  const router: Router = Router(); 
    // Create a new File 
  router.post('/', [verifyAccess, changeTenant, validateHeaders] ,controller.create);

    // Retrieve all estrutura_orcamento 
  router.get('/', [verifyAccess, changeTenant, validateHeaders], controller.findAll); 
    // Retrieve cout estrutura_orcamento
  router.get('/count', [verifyAccess, changeTenant], controller.getCount); 
    // Retrieve a single File with id 
  router.get('/:id', [verifyAccess, changeTenant], controller.findById); 
    // Update a File with id 
  router.put('/:id', [verifyAccess, changeTenant], controller.update); 
    // Delete a File with id 
  router.delete('/:id', [verifyAccess, changeTenant], controller.delete); 
    // Custom get File 
    router.post("/custom", [verifyAccess, changeTenant], controller.customQuery);

    app.use('/api/file', router); 
  }; 
