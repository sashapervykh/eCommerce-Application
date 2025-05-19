import { Link } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

export function AboutPage() {
  return (
    <div className="page">
      <h1>About page</h1>
      <Link to="/">
        <Button view="action" size="l">
          To main
        </Button>
      </Link>
    </div>
  );
}
