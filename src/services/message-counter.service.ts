export class MessageCounterService {
  private messageCount = 0;

  public getCount() {
    return this.messageCount;
  }

  public count() {
    this.messageCount++;
  }

  public reset() {
    this.messageCount = 0;
  }
}

export const messageCounter = new MessageCounterService();
