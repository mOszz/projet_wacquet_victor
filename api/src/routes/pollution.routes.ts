import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  getPhoto,
  remove,
  update,
} from '../controllers/pollution.controllers';
import { uploadPhoto } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/photo', getPhoto);
router.post('/', uploadPhoto, create);
router.put('/:id', uploadPhoto, update);
router.delete('/:id', remove);

export default router;
