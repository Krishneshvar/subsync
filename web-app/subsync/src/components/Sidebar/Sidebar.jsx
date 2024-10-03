import './Sidebar.css'

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
            <li className='side-item'>
              <span className="material-symbols-outlined icon">
                home
              </span>
              <span className="title">Home</span>
            </li>
            <li className='side-item'>
              <span className="material-symbols-outlined icon">
                groups
              </span>
              <span className="title">Customers</span>
            </li>
            <li className='side-item'>
              <span className="material-symbols-outlined icon">
                shop
              </span>
              <span className="title">Products</span>
            </li>
            <li className='side-item'>
              <span className="material-symbols-outlined icon">
                subscriptions
              </span>
              <span className="title">Subscriptions</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
