import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Public Navbar Placeholder */}
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* Public Footer Placeholder */}
      <Footer />
    </div>
  );
}
