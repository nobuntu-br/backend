import { Application, Router } from 'express';
import { verifyAccess } from '../middlewares/auth.middleware'; 
import changeTenant from '../middlewares/tenant.middleware'; 
import validateHeaders from './validators/index.validator';
import { FieldFileController } from '../controllers/fieldFile.controller';

export default function defineRoute(app: Application){ 
  const controller : FieldFileController= new FieldFileController(); 
  const router: Router = Router(); 
    // Create a new FieldFile 
  router.post('/', [verifyAccess, changeTenant, validateHeaders] ,controller.create);

    // Retrieve all estrutura_orcamento 
  router.get('/', [verifyAccess, changeTenant, validateHeaders], controller.findAll); 
    // Retrieve cout estrutura_orcamento
  router.get('/count', [verifyAccess, changeTenant], controller.getCount); 
    // Retrieve a single FieldFile with id 
  router.get('/:id', [verifyAccess, changeTenant], controller.findById); 
    // Update a FieldFile with id 
  router.put('/:id', [verifyAccess, changeTenant], controller.update); 
    // Delete a FieldFile with id 
  router.delete('/:id', [verifyAccess, changeTenant], controller.delete); 
    // Custom get FieldFile 
    router.post("/custom", [verifyAccess, changeTenant], controller.customQuery);
    // Upload a file
    router.post("/upload", [verifyAccess, changeTenant], controller.upload);

    app.use('/api/field-file', router); 
  }; 
