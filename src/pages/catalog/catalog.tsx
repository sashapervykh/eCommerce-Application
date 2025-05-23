import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <CatalogContent />
    </PageWrapper>
  );
}
