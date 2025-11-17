import mongoose, { Schema, Document } from 'mongoose';

export enum ColumnType {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

export interface ICard extends Document {
  boardId: string;
  title: string;
  description: string;
  column: ColumnType;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    boardId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    column: {
      type: String,
      enum: Object.values(ColumnType),
      required: true,
      default: ColumnType.TODO,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

CardSchema.index({ boardId: 1, column: 1, order: 1 });

export default mongoose.model<ICard>('Card', CardSchema);