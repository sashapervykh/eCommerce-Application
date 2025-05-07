import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="page">
      <h1>Login page</h1>
      <Link to="/">
        <button className="btn">To main</button>
      </Link>
    </div>
  );
}
