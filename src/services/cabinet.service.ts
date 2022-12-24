import axios from "axios";

import { config } from "../config";
import { cachePromise } from "../helpers/cache-promise";
import { Api } from "../models/api";
import { Cabinet } from "../models/cabinet.interface";
import { Collection } from "../models/collection.interface";
import { MyContext } from "../models/my-context.type";

export class CabinetsService implements Api<Cabinet, MyContext> {
  constructor(private api: string) {}

  public async findMany(query: string): Promise<Cabinet[]> {
    const cabinets = await this.getAll();

    return cabinets.filter(({ name }) => this.search(name, query));
  }

  public async findInContext(ctx: MyContext): Promise<Cabinet | undefined> {
    return undefined;
  }

  public async findInText(text: string): Promise<Cabinet | undefined> {
    const cabinets = await this.getAll();

    return cabinets.find(({ name }) => this.search(text, name));
  }

  public async findByName(name: string): Promise<Cabinet | undefined> {
    const cabinets = await this.getAll();

    return cabinets.find((cabinet) => this.search(cabinet.name, name));
  }

  public async findById(id: string): Promise<Cabinet | undefined> {
    const cabinets: Cabinet[] = await this.getAll();

    return cabinets.find((cabinet) => cabinet.id === id);
  }

  public getAll = cachePromise(
    axios.get<Collection<string>>(this.api).then(({ data }) =>
      Object.entries(data).map(
        ([id, name]: [string, string]): Cabinet => ({
          id,
          name,
        })
      )
    )
  );

  private search(first: string, second: string): boolean {
    first = first.toLowerCase().trim();
    second = second.toLowerCase().trim();

    return first.includes(second);
  }
}

export const cabinetsService = new CabinetsService(config.api.cabinets);
