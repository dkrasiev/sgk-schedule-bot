export class CounterService {
  private _count = 0

  public getCount() {
    return this._count
  }

  public count() {
    this._count++
  }

  public reset() {
    this._count = 0
  }
}
