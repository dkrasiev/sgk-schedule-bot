import { Index } from 'flexsearch'

import { MyContext } from '../modules/common'
import { trimCommand } from '../modules/common/utils/trim-command'
import { ScheduleEntity } from '../modules/core'
import { SGKApiService } from './sgk-api.service'

export class FinderService {
  private index = new Index({
    tokenize: 'full',
  })
  private map = new Map<string, ScheduleEntity>()

  constructor(private api: SGKApiService) {}

  public async init() {
    // [
    //   ...(await this.api
    //     .fetchGroups()
    //     .then((entities) =>
    //       entities.map((entity) => new Group(entity.id, entity.name)),
    //     )
    //     .then((groups) => groups.sort((a, b) => a.name.localeCompare(b.name)))
    //     .then((groups) =>
    //       groups.sort((a, b) => a.name.length - b.name.length),
    //     )),
    //   ...(await this.api
    //     .fetchTeachers()
    //     .then((entities) =>
    //       entities.map((entity) => new Teacher(entity.id, entity.name)),
    //     )
    //     .then((teachers) =>
    //       teachers.filter((teacher) => teacher.name.split(" ").length > 2),
    //     )
    //     .then((teachers) =>
    //       teachers.sort((a, b) => a.name.localeCompare(b.name)),
    //     )),
    //   ...(await this.api
    //     .fetchCabinets()
    //     .then((entities) =>
    //       entities.map((entity) => new Cabinet(entity.id, entity.name)),
    //     )
    //     .then((cabinets) =>
    //       cabinets.filter(
    //         (cabinet) => cabinet.name !== "п/п" && cabinet.name !== "дист/дист",
    //       ),
    //     )
    //     .then((cabinets) =>
    //       cabinets.sort((a, b) => a.name.localeCompare(b.name)),
    //     )),
    // ].forEach((entity) => {
    //   this.map.set(entity.id, entity);
    //   this.index.add(entity.id, entity.name.replace(/-/g, ""));
    // });
  }

  public searchInContext(ctx: MyContext): ScheduleEntity[] {
    const query = ctx.message?.text ? trimCommand(ctx.message.text) : ''
    if (query) {
      const searchByNameResult = this.search(query)
      if (searchByNameResult.length) {
        return searchByNameResult
      }
    }

    const defaultEntity = ctx.getDefault()
    if (defaultEntity) {
      return [defaultEntity]
    }

    return []
  }

  public search(query: string): ScheduleEntity[] {
    return this.index
      .search(query)
      .map((id) => this.getById(String(id)))
      .filter(Boolean) as ScheduleEntity[]
  }

  public getById(id: string): ScheduleEntity | undefined {
    return this.map.get(id)
  }
}
