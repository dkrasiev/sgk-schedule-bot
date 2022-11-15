import { Schema, model, Document } from "mongoose";

export interface GroupDocument extends Document {
  id: number;
  name: string;
}

const GroupSchema = new Schema({
  id: Number,
  name: String,
});

export const groups = model<GroupDocument>("Group", GroupSchema);
