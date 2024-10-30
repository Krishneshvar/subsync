import './Footer.css'

function Footer() {

  const currYear = new Date().getFullYear();

    return (
      <>
        <footer className="foot d-flex align-items-center justify-content-center p-1 bg-dark text-light">
          &copy; {currYear}
        </footer>
      </>
    )
}

export default Footer
