import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';
import { SortComponent } from './components/sort-selector/sort-component';

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <SortComponent />
      <CatalogContent />
    </PageWrapper>
  );
}
