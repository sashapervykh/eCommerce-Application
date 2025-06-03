import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { CatalogContent } from './components/catalog-content/catalog-component';
import { useParams } from 'react-router-dom';

export function CatalogPage() {
  const { categoryKey, subcategoryKey } = useParams<{ categoryKey?: string; subcategoryKey?: string }>();

  return (
    <PageWrapper title="Catalog">
      <CatalogContent categoryKey={categoryKey} subcategoryKey={subcategoryKey} />
    </PageWrapper>
  );
}
