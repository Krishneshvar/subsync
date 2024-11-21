import './Sidebar.css'

function Sidebar() {

return (
    <>
      <div className='sidebar'>
        <div className='top'>
          <div> Sidebar </div>
          <div>
            <span class="material-symbols-outlined move-sidebar">
              dock_to_right
            </span>
          </div>
        </div>
        <div className='menu'>
          <ul className='side-list'>
            <li className='side-item'>
              <span id="icon" class="material-symbols-outlined">
                home
              </span>
              <span id="title"> Home </span>
              </li>
            <li className='side-item'>
              <span id="icon" class="material-symbols-outlined">
                groups
              </span>
              <span id="title"> Customers </span>
            </li>
            <li className='side-item'>
              <span id="icon" class="material-symbols-outlined">
                subscriptions
              </span>
              <span id="title"> Subscriptions </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Sidebar
