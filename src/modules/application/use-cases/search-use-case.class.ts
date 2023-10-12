import { ISearchRepository } from '../interfaces/search-repository.interface'

export class SearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  public async execute(query: string) {
    return this.searchRepository.search(query)
  }
}
