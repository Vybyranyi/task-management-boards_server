import { Router } from 'express';
import { getCards, createCard, updateCard, deleteCard, moveCard } from '../controllers/cardController';

const router = Router();

router.get('/board/:boardId', getCards);
router.post('/board/:boardId', createCard);
router.put('/:cardId', updateCard);
router.delete('/:cardId', deleteCard);
router.patch('/:cardId/move', moveCard);

export default router;