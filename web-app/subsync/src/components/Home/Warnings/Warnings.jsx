import '../TableStyles.css'

function Warnings() {

  return (
    <>
      <div className='warnings-table'>
        <table>
          <thead>
            <tr>
              <th colSpan="100%" className='warnings'>                <i class="fas fa-exclamation-triangle warning-icon" title="Warning"></i>

              Warnings </th>
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

export default Warnings
