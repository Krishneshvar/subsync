import './Navbar.css'

function Navbar() {

    return (
      <>
        <nav className="nav">
          <div className='logo'></div>
          <div>
            <ul className='navlist'>
              <li className='navitem material-symbols-outlined'>
                help
              </li>
              <li className='navitem material-symbols-outlined'>
                notifications
              </li>
              <li className='navitem material-symbols-outlined'>
                account_circle
              </li>
            </ul>
          </div>
        </nav>
      </>
    )
}

export default Navbar
