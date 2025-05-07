import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page">
      <h1>Main page</h1>
      <Link to="/login">
        <button className="btn">To login</button>
      </Link>
    </div>
  );
}
