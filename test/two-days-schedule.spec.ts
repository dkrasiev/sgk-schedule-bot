import { TwoDaysScheduleUseCase } from '../src/modules/application'
import { MockScheduleRepository } from './mocks/mock-schedule-repository.class'

describe('Two Days Schedule Use Case', () => {
  const DATES = {
    monday: () => new Date('2023-10-09'),
    tuesday: () => new Date('2023-10-10'),
    wednesday: () => new Date('2023-10-11'),
    thursday: () => new Date('2023-10-12'),
    friday: () => new Date('2023-10-13'),
    saturday: () => new Date('2023-10-14'),
    sunday: () => new Date('2023-10-15'),
    nextMonday: () => new Date('2023-10-16'),
    nextTuesday: () => new Date('2023-10-17'),
  }

  const scheduleRepository = new MockScheduleRepository()
  const twoDaysScheduleUseCase = new TwoDaysScheduleUseCase(scheduleRepository)

  async function execute() {
    return await twoDaysScheduleUseCase.execute({
      id: 'id',
      name: 'name',
    })
  }

  it('should return schedule for monday and tuesday on monday', async () => {
    jest.setSystemTime(DATES.monday())

    const result = await twoDaysScheduleUseCase.execute({
      name: 'name',
      id: 'id',
    })

    expect(result[0].date).toEqual(DATES.monday().toString())
    expect(result[1].date).toEqual(DATES.tuesday().toString())
  })

  it('should return schedule for tuesday and wednesday on tuesday', async () => {
    jest.setSystemTime(DATES.tuesday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.tuesday().toString())
    expect(result[1].date).toEqual(DATES.wednesday().toString())
  })

  it('should return schedule for wednesday and thursday on wednesday', async () => {
    jest.setSystemTime(DATES.wednesday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.wednesday().toString())
    expect(result[1].date).toEqual(DATES.thursday().toString())
  })

  it('should return schedule for thursday and friday on thursday', async () => {
    jest.setSystemTime(DATES.thursday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.thursday().toString())
    expect(result[1].date).toEqual(DATES.friday().toString())
  })

  it('should return schedule for friday and monday on friday', async () => {
    jest.setSystemTime(DATES.friday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.friday().toString())
    expect(result[1].date).toEqual(DATES.nextMonday().toString())
  })

  it('should return schedule for monday and tuesday on saturday', async () => {
    jest.setSystemTime(DATES.saturday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.nextMonday().toString())
    expect(result[1].date).toEqual(DATES.nextTuesday().toString())
  })

  it('should return schedule for monday and tuesday on sunday', async () => {
    jest.setSystemTime(DATES.sunday())

    const result = await execute()

    expect(result[0].date).toEqual(DATES.nextMonday().toString())
    expect(result[1].date).toEqual(DATES.nextTuesday().toString())
  })
})
