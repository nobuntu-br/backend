import { Application, Router } from 'express';
import validateHeaders from './validators/index.validator';
import { OrderController } from '../controllers/order.controller';
import { createNewOrderValidator, findAllOrderValidator } from './validators/order.validator';
import { checkUserAccess } from '../middlewares/checkUserAccess.middleware';

/**
 * Irá definir as rotas da entidade
 * @param app Instância da aplicação express
 */
export default function defineRoute(app: Application){
  const controller: OrderController = new OrderController();
  const router: Router = Router();
  
  //Create a new
  router.post('/', [checkUserAccess, ...createNewOrderValidator, validateHeaders], controller.create);
  //Find all
  router.get('/', [checkUserAccess, ...findAllOrderValidator, validateHeaders], controller.findAll);
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
