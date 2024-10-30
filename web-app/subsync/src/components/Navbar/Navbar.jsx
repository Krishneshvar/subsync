import './Navbar.css';

const navItems = [
  { icon: 'help', key: 'help' },
  { icon: 'notifications', key: 'notifications' },
  { icon: 'account_circle', key: 'account_circle' },
];

function Navbar() {
  return (
    <nav className="nav">
      <div className='logo'></div>
      <div>
        <ul className='navlist'>
          {
            navItems.map((item) => (
              <li key={item.key} className={'navitem material-symbols-outlined'}>
                {item.icon}
              </li>
            ))
          }
        </ul>
      </div>
    </nav>
  );
}

export default Navbar
