import './home.css'
import Reminders from './Reminders/Reminders'
import Warnings from './Warnings/Warnings'

function Home() {

  return (
    <>
      <div className='gist'>
        <div className='home-comps'>
          <h1 className='greeting'> Welcome Admin! </h1>
        </div>
        <div className='home-comps'>
          <Reminders />
        </div>
        <div className='home-comps'>
          <Warnings />
        </div>      
      </div>
    </>
  )
}

export default Home
