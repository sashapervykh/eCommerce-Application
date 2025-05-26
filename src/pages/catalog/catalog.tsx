import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';
import { ListControls } from './components/list-controls/list-controls';

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <ListControls />
      <CatalogContent />
    </PageWrapper>
  );
}
