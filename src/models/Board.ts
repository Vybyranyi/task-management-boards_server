import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  boardId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IBoard>('Board', BoardSchema);