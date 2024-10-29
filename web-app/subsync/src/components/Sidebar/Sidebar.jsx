import './Sidebar.css'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <>
      <div className='sidebar'>
        <div className='top'>
          <div>SubSync</div>
          <div>
            <span className="material-symbols-outlined move-sidebar">
              dock_to_right
            </span>
          </div>
        </div>
        <div className='menu'>
          <ul className='side-list'>
            <Link to='/'>
              <li className='side-item'>
                <span className="material-symbols-outlined icon">
                  home
                </span>
                <span className="title">Home</span>
              </li>
            </Link>
            <Link to='/customers'>
              <li className='side-item'>
                <span className="material-symbols-outlined icon">
                  groups
                </span>
                <span className="title">Customers</span>
              </li>
            </Link>
            <Link to='/products'>
              <li className='side-item'>
                <span className="material-symbols-outlined icon">
                  shop
                </span>
                <span className="title">Products</span>
              </li>
            </Link>
            <Link to='/subscriptions'>
              <li className='side-item'>
                <span className="material-symbols-outlined icon">
                  subscriptions
                </span>
                <span className="title">Subscriptions</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
