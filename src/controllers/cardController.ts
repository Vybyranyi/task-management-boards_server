import { Request, Response } from 'express';
import Card, { ColumnType } from '../models/Card';
import Board from '../models/Board';

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });
    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const cards = await Card.find({ boardId }).sort({ column: 1, order: 1 });

    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

export const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { title, description, column = ColumnType.TODO } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Card title is required' });
      return;
    }

    const board = await Board.findOne({ boardId });
    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    const maxOrderCard = await Card.findOne({ boardId, column }).sort({ order: -1 });
    const order = maxOrderCard ? maxOrderCard.order + 1 : 0;

    const card = new Card({
      boardId,
      title: title.trim(),
      description: description?.trim() || '',
      column,
      order,
    });

    await card.save();

    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
};

export const updateCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { title, description } = req.body;

    const updateData: Partial<{ title: string; description: string }> = {};

    if (title !== undefined) {
      if (title.trim() === '') {
        res.status(400).json({ error: 'Card title cannot be empty' });
        return;
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    const card = await Card.findByIdAndUpdate(cardId, updateData, { new: true });

    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
};

export const deleteCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
};

export const moveCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { column, order } = req.body;

    if (!column || order === undefined) {
      res.status(400).json({ error: 'Column and order are required' });
      return;
    }

    const card = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    const oldColumn = card.column;
    const oldOrder = card.order;

    if (oldColumn === column) {
      if (oldOrder < order) {
        await Card.updateMany(
          { boardId: card.boardId, column, order: { $gt: oldOrder, $lte: order } },
          { $inc: { order: -1 } },
        );
      } else if (oldOrder > order) {
        await Card.updateMany(
          { boardId: card.boardId, column, order: { $gte: order, $lt: oldOrder } },
          { $inc: { order: 1 } },
        );
      }
    } else {
      await Card.updateMany(
        { boardId: card.boardId, column: oldColumn, order: { $gt: oldOrder } },
        { $inc: { order: -1 } },
      );

      await Card.updateMany(
        { boardId: card.boardId, column, order: { $gte: order } },
        { $inc: { order: 1 } },
      );
    }

    card.column = column;
    card.order = order;
    await card.save();

    res.status(200).json(card);
  } catch (error) {
    console.error('Error moving card:', error);
    res.status(500).json({ error: 'Failed to move card' });
  }
};