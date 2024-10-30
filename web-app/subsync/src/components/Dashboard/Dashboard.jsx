import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';

function Dashboard() {
  return (
    <div className='app-container'>
      <div className='main'>
        <Sidebar />
        <div className='contents'>
          <Navbar />
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
