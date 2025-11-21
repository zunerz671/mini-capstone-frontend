import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Layout.css'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">VOLLEYBALL_MANAGER</h1>
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              DASHBOARD
            </Link>
            <Link 
              to="/teams" 
              className={`nav-link ${isActive('/teams') ? 'active' : ''}`}
            >
              TEAMS
            </Link>
            <Link 
              to="/games" 
              className={`nav-link ${isActive('/games') ? 'active' : ''}`}
            >
              GAMES
            </Link>
          </nav>
          <div className="user-section">
            <span className="user-badge">{user?.role?.toUpperCase()}</span>
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              LOGOUT
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
