import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo">
          React<span className="accent">Man</span>
        </NavLink>
        <nav className="site-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            ホーム
          </NavLink>
          <NavLink
            to="/tags"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            タグ
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
