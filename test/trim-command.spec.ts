import { trimCommand } from '../src/modules/common'

describe('trimCommand function', () => {
  it('should return a string after a command', () => {
    expect(trimCommand('/schedule ис1904')).toBe('ис1904')
  })

  it('should return an empty string if no command in text', () => {
    expect(trimCommand('schedule ис1904')).toBe('schedule ис1904')
  })

  it('should return a trimmed string', () => {
    expect(trimCommand('   ')).toBe('')
  })

  it('should return an empty string for a command without arguments', () => {
    expect(trimCommand('/setdefault')).toBe('')
  })

  it('should return an empty string if input string is empty', () => {
    expect(trimCommand('')).toBe('')
  })

  it("shouldn't apply toLowerCase", () => {
    expect(trimCommand('/schedule ИС1904 ТЕСТ  ')).toBe('ИС1904 ТЕСТ')
  })
})
