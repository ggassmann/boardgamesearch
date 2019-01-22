import { Container } from '../lib/Container';
import { ISearchFacet } from '../lib/ISearchFacet';
import { ISearchFilter } from '../lib/ISearchFilter';

interface ISearchStoreStateProps {
  input?: string;
  filters?: ISearchFilter[];
  facets?: ISearchFacet[];
}

export class SearchStore extends Container<ISearchStoreStateProps> {
  public state: ISearchStoreStateProps = {
    input: '',
    filters: [],
    facets: [],
  };

  public removeFilter(filter: ISearchFilter) {
    this.setState({
      filters: this.state.filters.filter((x) => x !== filter),
    });
  }
}
