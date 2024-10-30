import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

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
    </div>
  );
}

export default Dashboard;
