import {Schema, model, Document} from 'mongoose';
import Schedule from '../types/schedule.type';

export interface ChatDocument extends Document {
  id: number;
  defaultGroup?: number;
  subscription: {
    groupId?: number;
    lastSchedule: Schedule;
  };
}

const ChatSchema = new Schema({
  id: {type: Number, require: true},
  defaultGroup: {type: Number, require: false},
  subscription: {
    groupId: {type: Number, require: false},
    lastSchedule: {
      date: String,
      lessons: [
        {
          _id: false,
          title: String,
          num: String,
          teachername: String,
          nameGroup: String,
          cab: String,
          resource: String,
        },
      ],
    },
  },
});

export const chats = model<ChatDocument>('Chat', ChatSchema);
