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

          
          <div className="footer-contact">

            <p className="contact-item">
              <span className="icon email-icon"></span>
                <a href="mailto:diyamodular@gmail.com?subject=Interior%20Enquiry">
                  diyamodular@gmail.com
                </a>
            </p>

            <p className="contact-item">
              <span className="icon phone-icon"></span>
              <a href="tel:+919597882019">+91 95978 82019</a>
            </p>

            <p className="contact-item">
              <span className="icon location-icon"></span>
              <a
                href="https://www.google.com/maps?q=No 360/ 2C1, CODEA PARK, Kurumbapalayam SSKulam, Tamil Nadu 641107"
                target="_blank"
                rel="noopener noreferrer"
              >
                No 360/2C1, CODEA PARK, Kurumbapalayam SSKulam,Coimbatore, Tamil Nadu - 641107
              </a>
            </p>
          </div>


        </div>
      </div>
    </footer>
  )
}

export default Footer
