import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';
import { SearchComponent } from './components/search-component/search-component';
import { SortComponent } from './components/sort-selector/sort-component';
import styles from './style.module.css';

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <div className={styles['list-controls']}>
        <SearchComponent />
        <SortComponent />
      </div>

      <CatalogContent />
    </PageWrapper>
  );
}
