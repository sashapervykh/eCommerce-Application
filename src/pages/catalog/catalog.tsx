import { Button } from '@gravity-ui/uikit';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';
import { SearchComponent } from './components/search-component/search-component';
import { SortComponent } from './components/sort-selector/sort-component';
import styles from './style.module.css';
import { useProducts } from '../../components/hooks/useProducts';

export function CatalogPage() {
  const { setIsFiltersOpen } = useProducts();
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <div className={styles['list-controls']}>
        <Button
          size="xl"
          className={styles['filters-button']}
          view="outlined"
          onClick={() => {
            setIsFiltersOpen((previous: boolean) => !previous);
          }}
        >
          Filter
        </Button>
        <SortComponent />
        <SearchComponent />
      </div>

      <CatalogContent />
    </PageWrapper>
  );
}
