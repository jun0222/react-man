import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <p className="not-found__msg">Page not found.</p>
      <Link to="/" className="btn">Back to Home</Link>
    </main>
  )
}
