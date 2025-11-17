import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Board from '../models/Board';
import Card from '../models/Card';

export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Board name is required' });
      return;
    }

    const boardId = nanoid(10);

    const board = new Board({
      boardId,
      name: name.trim(),
    });

    await board.save();

    res.status(201).json({
      boardId: board.boardId,
      name: board.name,
      createdAt: board.createdAt,
    });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
};

export const getBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });

    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    res.status(200).json({
      boardId: board.boardId,
      name: board.name,
      createdAt: board.createdAt,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
};

export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Board name is required' });
      return;
    }

    const board = await Board.findOneAndUpdate(
      { boardId },
      { name: name.trim() },
      { new: true },
    );

    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    res.status(200).json({
      boardId: board.boardId,
      name: board.name,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;

    const board = await Board.findOneAndDelete({ boardId });

    if (!board) {
      res.status(404).json({ error: 'Board not found' });
      return;
    }

    await Card.deleteMany({ boardId });

    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
};