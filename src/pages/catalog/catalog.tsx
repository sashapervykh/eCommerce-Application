import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Button } from '@gravity-ui/uikit';

function CatalogContent() {
  return (
    <div>
      <h1>Catalog Content</h1>
      {/* Catalog Content */}
    </div>
  );
}

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <div>
        <Button view="outlined">Moon</Button>
      </div>
      <CatalogContent />
    </PageWrapper>
  );
}
