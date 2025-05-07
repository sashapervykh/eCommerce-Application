import { Link } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

export default function CatalogPage() {
  return (
    <div className="page">
      <h1>Catalog page</h1>
      <Link to="/">
        <Button view="action" size="l">
          To main
        </Button>
      </Link>
    </div>
  );
}
