import { I18nFlavor } from '@grammyjs/i18n'
import { Context, SessionFlavor } from 'grammy'
import { Container } from 'inversify'

import { ScheduleEntity } from '../../../modules/core'
import { MySession } from './my-session.interface'

export interface MyFlavor {
  getDefault(): ScheduleEntity | undefined
  container: Container
}

export type MyContext = Context &
  I18nFlavor &
  SessionFlavor<MySession> &
  MyFlavor
