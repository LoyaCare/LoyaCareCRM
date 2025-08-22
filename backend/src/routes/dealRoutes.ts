import { Router } from 'express';
import * as dealController from '../controllers/dealController';

const router = Router();

router.post('/', dealController.createDeal);
router.get('/', dealController.getAllDeals);
router.get('/archived', dealController.getArchivedDeals);
router.get('/:id', dealController.getDealById);
router.put('/:id', dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);

export default router;