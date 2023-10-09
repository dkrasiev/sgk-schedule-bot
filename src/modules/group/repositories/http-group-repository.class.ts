import {
  IScheduleEntityFactory,
  IScheduleEntityRepository,
  ScheduleEntity,
} from "../../core";
import { IHTTPClient } from "../../http";
import { Group } from "../models/group.class";

export class HTTPGroupRepository implements IScheduleEntityRepository {
  constructor(
    private httpClient: IHTTPClient,
    private groupFactory: IScheduleEntityFactory<Group>,
    private groupApiUrl: string,
  ) {}

  public async getAll(): Promise<Group[]> {
    return this.httpClient
      .get<Array<{ id: number; name: string }>>(this.groupApiUrl)
      .then((data) =>
        data.map(({ id, name }) =>
          this.groupFactory.createEntity(String(id), name),
        ),
      );
  }

  public async getById(id: string): Promise<ScheduleEntity | undefined> {
    if (!id) {
      return;
    }

    return this.getAll().then((entities) => entities.find((e) => e.id === id));
  }
}
