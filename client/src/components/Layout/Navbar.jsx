import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left" />

      <div className="navbar-right">
        {user && (
          <>
            <span>{user.username}</span>
            <button className="secondary-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
