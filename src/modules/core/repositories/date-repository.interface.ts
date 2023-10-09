export interface IDateRepository {
  formatDate(date: Date): string;
  getNextWeekday(date: Date): Date;
}
