import './Dashboard.css'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Home from '../Home/Home'

function Dashboard() {

  return (
    <>
      <div className='app-container'>
        <div className='main'>
          <Sidebar />
          <div className='contents'>
            <Navbar />
            <Home />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default Dashboard
