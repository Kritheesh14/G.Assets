import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import './layout.css';

export default function MainLayout({ children }) {
  return (
    <div className="layout-root">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
