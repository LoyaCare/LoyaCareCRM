import { Router } from 'express';
import * as leadController from '../controllers/leadController';

const router = Router();

router.post('/', leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/archived', leadController.getArchivedLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export default router;