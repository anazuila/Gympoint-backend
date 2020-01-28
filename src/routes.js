import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import StudentsController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PlansController from './app/controllers/PlansController';
import ManagementController from './app/controllers/ManagementController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.post('/management', ManagementController.store);
routes.get('/management', ManagementController.index);
routes.put('/management/:id', ManagementController.update);
routes.delete('/management/:id', ManagementController.delete);

export default routes;
