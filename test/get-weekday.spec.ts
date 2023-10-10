/* eslint @typescript-eslint/no-unused-vars: 0 */

import dayjs from 'dayjs'
import mockdate from 'mockdate'
import { getWeekday } from '../src/utils/get-weekday'

describe('getWeekday', () => {
  const sunday = '2023-03-12T00:00:00Z'
  const monday = '2023-03-13T00:00:00Z'
  const tuesday = '2023-03-14T00:00:00Z'
  const wednesday = '2023-03-15T00:00:00Z'
  const thursday = '2023-03-16T00:00:00Z'
  const friday = '2023-03-17T00:00:00Z'
  const saturday = '2023-03-18T00:00:00Z'

  afterEach(() => {
    mockdate.reset()
  })

  it('should use current date as a default date', () => {
    mockdate.set(wednesday)

    expect(getWeekday().diff(dayjs(), 'day')).toBe(0)
  })

  it('should return monday on saturday', () => {
    mockdate.set(saturday)

    const nextMonday = dayjs(monday).add(7, 'day')

    expect(getWeekday().day()).toBe(1)
    expect(getWeekday().diff(nextMonday, 'day')).toBe(0)
  })
})
