import { ISearchRepository } from '..'

export class SearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  public async execute(query: string) {
    return this.searchRepository.search(query)
  }
}
