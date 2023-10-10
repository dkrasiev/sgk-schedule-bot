// import { run } from '@grammyjs/runner'

// import bot from './config/bot'
// import { MONGODB_NAME } from './config/config'
import { diContainerService } from './config/container'
import logger from './config/logger'
import { TYPES } from './config/types.const'
import { Cabinet } from './modules/cabinet'
import {
  IScheduleEntityRepository,
  IScheduleRepository,
  ISearchRepository,
  TwoDaysScheduleUseCase,
} from './modules/core'
import { Group } from './modules/group'
import { Teacher } from './modules/teacher'

// main().catch((e) => logger.error(e));
main()

async function main() {
  logger.info('starting...')

  // await bot.init()

  diContainerService.setup()

  const container = diContainerService.container
  const scheduleEntityRepository = container.get<IScheduleEntityRepository>(
    TYPES.MainScheduleEntityRepository,
  )
  const searchRepository = container.get<ISearchRepository>(
    TYPES.SearchRepository,
  )
  const scheduleRepository = container.get<IScheduleRepository>(
    TYPES.ScheduleRepository,
  )

  const entities = await scheduleEntityRepository.getAll()
  console.log(entities.length)

  const groups = entities.filter((e) => e instanceof Group)
  const teachers = entities.filter((e) => e instanceof Teacher)
  const cabinets = entities.filter((e) => e instanceof Cabinet)

  console.log('GROUPS', groups.length)
  console.log('TEACHERS', teachers.length)
  console.log('CABINETS', cabinets.length)

  const entityForSchedule = teachers.find((t) => t.name.includes('Кулагин'))
  console.log(entityForSchedule)

  if (entityForSchedule) {
    const schedules = await new TwoDaysScheduleUseCase(
      scheduleRepository,
    ).execute(entityForSchedule)
    console.log(
      schedules.map((s) => ({
        ...s,
        lessons: s.lessons.map((l) => l.nameGroup),
      })),
    )
  }

  const findResult = await searchRepository.search('Андрей')
  console.log('founded', findResult)

  // logger.info(`database name: ${MONGODB_NAME}`)
  // logger.info(`bot username: @${bot.botInfo.username}`)

  // run(bot)
}

// import { container } from "./config/container";
// import { ScheduleEntityService, ScheduleService } from "./modules/core";

// async function main() {
//   const scheduleEntityService = container.get<ScheduleEntityService>(
//     ScheduleEntityService,
//   );
//   const scheduleService = container.get<ScheduleService>(ScheduleService);

//   const finded = await scheduleEntityService.find("Кулагин");
//   console.log(finded);
//   if (finded) {
//     const schedule = await scheduleService.getSchedule(finded);
//     console.log(schedule);
//   }
// }
//
// main();
