import '../TableStyles.css'

function Reminders() {
  const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Products', 'License usage', '', ];

  return (
    <>
      <div className='reminders-table'>
        <table>
          <thead>
            <tr>
              <th colSpan="100%" className='reminders'>
                <i className="fas fa-bell reminder-icon" title="Reminder"></i>
                Reminders
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              {
                (() => {
                  const headerElements = [];
                  for (let i = 0; i < headers.length; i++) {
                    headerElements.push(<th key={i}>{headers[i]}</th>);
                  }
                  return headerElements;
                })()
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Someone </td>
              <td> Somewhere </td>
              <td> Some </td>
              <td> Sometime </td>
              <td> A while </td>
              <td> Some </td>
              <td> Some </td>
              <td>
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Reminders
