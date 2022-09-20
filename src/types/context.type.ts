import {Context} from 'telegraf';
import I18n from 'telegraf-i18n';
import {GroupDocument} from '../models/group.model';

export interface MyContext extends Context {
  i18n: I18n;
  session?: {
    group?: GroupDocument;
    messageHasGroup?: boolean;
  };
}
