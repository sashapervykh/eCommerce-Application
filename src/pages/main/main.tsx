import { Link } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

export default function HomePage() {
  return (
    <div className="page">
      <h1>Main page</h1>
      <Link to="/login">
        <Button view="action" size="l">
          To login
        </Button>
      </Link>
    </div>
  );
}
