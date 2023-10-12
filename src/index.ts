// import { run } from '@grammyjs/runner'

// import bot from './config/bot'
// import { MONGODB_NAME } from './config/config'
import {
  IScheduleRepository,
  ISearchRepository,
  TwoDaysScheduleUseCase,
} from '@modules/application'

import { diContainerService } from './config/container'
import logger from './config/logger'
import { TYPES } from './config/types.const'

// main().catch((e) => logger.error(e));
main()

async function main() {
  logger.info('starting...')

  // await bot.init()

  diContainerService.setup()

  const container = diContainerService.container
  const searchRepository = container.get<ISearchRepository>(
    TYPES.SearchRepository,
  )
  const scheduleRepository = container.get<IScheduleRepository>(
    TYPES.ScheduleRepository,
  )
  const twoDaysScheduleUseCase = new TwoDaysScheduleUseCase(scheduleRepository)

  const result = await searchRepository.search('Кулагин')
  const entity = result[0]
  if (entity) {
    const [first, second] = await twoDaysScheduleUseCase.execute(entity)

    console.log(first)
    console.log(second)
  }

  // logger.info(`database name: ${MONGODB_NAME}`)
  // logger.info(`bot username: @${bot.botInfo.username}`)

  // run(bot)
}
