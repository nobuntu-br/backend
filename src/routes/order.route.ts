import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import changeTenant from '../middlewares/tenant.middleware';
import { OrderController } from '../controllers/order.controller';
import { createNewOrderValidator, findAllOrderValidator } from './validators/order.validator';
import { verifyAccess } from '../middlewares/auth.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application){
  const controller: OrderController = new OrderController();
  const router: Router = Router();
  
  //Create a new
  router.post('/', [verifyAccess, changeTenant, ...createNewOrderValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [verifyAccess, changeTenant, ...findAllOrderValidator, validateHeaders], controller.findAll);
  //Find count
  router.get('/count', controller.getCount);
  //Find by id
  router.get('/:id', controller.findById);
  //Update
  router.put('/:id', controller.update);
  //Delete all
  router.delete('/all', controller.deleteAll);
  //Delete
  router.delete('/:id', controller.delete);
    
  app.use('/api/order', router);
} 
