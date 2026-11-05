import { Router } from 'express';
import { create, getAll } from '../controllers/user.controllers';

const router = Router();

router.get('/', getAll);
router.post('/', create);

export default router;
