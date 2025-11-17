import { Router } from 'express';
import { createBoard, getBoard, updateBoard, deleteBoard } from '../controllers/boardController';

const router = Router();

router.post('/', createBoard);
router.get('/:boardId', getBoard);
router.put('/:boardId', updateBoard);
router.delete('/:boardId', deleteBoard);

export default router;