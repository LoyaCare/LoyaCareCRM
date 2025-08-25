import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  blockUser,
  unblockUser
} from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// User status management routes
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/block', blockUser);
router.patch('/:id/unblock', unblockUser);

export default router;