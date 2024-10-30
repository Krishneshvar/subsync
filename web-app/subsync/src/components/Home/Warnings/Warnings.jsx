import '../TableStyles.css'

function Warnings() {
  const headers = ['Name', 'Domain', 'Subscriptions', 'Renewal date', 'Client since', 'Products', 'License usage', '', ];

  return (
    <>
      <div className='warnings-table'>
        <table>
          <thead>
            <tr>
              <th colSpan="100%" className='warnings'>
                <i class="fas fa-exclamation-triangle warning-icon" title="Warning"></i>
                Warnings
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

export default Warnings
