import '../TableStyles.css'

function Reminders() {
  return (
    <>
      <div className='reminders-table'>
        <table>
          <thead>
            <tr>
              <th colSpan="100%" className='reminders' >           <i class="fas fa-bell reminder-icon" title="Reminder"></i>

              Reminders </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th> Name </th>
              <th> Domain </th>
              <th> Subscriptions </th>
              <th> Renewal date </th>
              <th> Client since </th>
              <th> Products </th>
              <th> License usage </th>
              <th></th>
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
          <tfoot><tr><td colSpan="100%"></td></tr></tfoot>
        </table>
      </div>
    </>
  )
}

export default Reminders
