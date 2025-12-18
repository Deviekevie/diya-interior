import './Footer.css'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className='footer-wrapper'>
        <div className='footer-main'>
          <h1>DIYA MODULAR.</h1>

          <div className='footer-nav'>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/works" className="nav-link">Works</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
