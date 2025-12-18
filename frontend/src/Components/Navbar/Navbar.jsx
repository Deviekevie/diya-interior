import { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const hamburgerRef = useRef(null)

  // Close menu on route change
  useEffect(() => {
    setMenu(false)
  }, [location.pathname])

  // Close menu on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menu) {
        setMenu(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [menu])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenu(false)
      }
    }

    if (menu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menu])

  // Close menu when screen resizes to desktop (above 950px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 950 && menu) {
        setMenu(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [menu])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menu])

  return (
    <>
      <motion.nav
        initial={{ top: "-100%" }}
        animate={{ top: 0 }}
        transition={{ duration: 2, delay: 2 }}
      >
        <div className='nav-wrapper'>
          <div className='logo'>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img
                src="/Images/Home/logo.png"
                alt="Home"
                style={{ width: '150px', height: '40px' }}
              />
            </Link>
          </div>

          <div className='nav-items'>
            {/* Desktop menu items - hidden on mobile */}
            <Link 
              to='/' 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: "black" }}
            >
              <span>Home</span>
            </Link>

            <Link 
              to='/about' 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: "black" }}
            >
              <span>About</span>
            </Link>

            <Link 
              to='/works' 
              className={`nav-link ${location.pathname === '/works' ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: "black" }}
            >
              <span>Works</span>
            </Link>

            <Link 
              to='/contact' 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: "black" }}
            >
              <span>Contact</span>
            </Link>

            <Link 
              to='/Admin' 
              className={`nav-link ${location.pathname === '/Admin' || location.pathname === '/admin-login' || location.pathname.startsWith('/admin') ? 'active' : ''}`}
              style={{ textDecoration: 'none', color: "black" }}
            >
              <span>Admin</span>
            </Link>

            {/* Hamburger button - only visible on mobile */}
            <button
              ref={hamburgerRef}
              className='menu-btn'
              onClick={() => setMenu(!menu)}
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              type="button"
            >
              {menu ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menu && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenu(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Menu */}
            <motion.div
              ref={menuRef}
              className="menu-sm"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              aria-label="Mobile navigation menu"
              role="navigation"
            >
              <button
                className='close-btn'
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                type="button"
              >
                <AiOutlineClose />
              </button>

              <motion.div
                className="menu-sm-items"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  to='/'
                  className={`mobile-link ${location.pathname === '/' ? 'active' : ''}`}
                  style={{ textDecoration: 'none', color: "white" }}
                  onClick={() => setMenu(false)}
                >
                  <motion.span
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Home
                  </motion.span>
                </Link>

                <Link
                  to='/about'
                  className={`mobile-link ${location.pathname === '/about' ? 'active' : ''}`}
                  style={{ textDecoration: 'none', color: "white" }}
                  onClick={() => setMenu(false)}
                >
                  <motion.span
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    About
                  </motion.span>
                </Link>

                <Link
                  to='/works'
                  className={`mobile-link ${location.pathname === '/works' ? 'active' : ''}`}
                  style={{ textDecoration: 'none', color: "white" }}
                  onClick={() => setMenu(false)}
                >
                  <motion.span
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Works
                  </motion.span>
                </Link>

                <Link
                  to='/contact'
                  className={`mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}
                  style={{ textDecoration: 'none', color: "white" }}
                  onClick={() => setMenu(false)}
                >
                  <motion.span
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Contact
                  </motion.span>
                </Link>

                <Link
                  to='/Admin'
                  className={`mobile-link ${location.pathname === '/Admin' || location.pathname === '/admin-login' || location.pathname.startsWith('/admin') ? 'active' : ''}`}
                  style={{ textDecoration: 'none', color: "white" }}
                  onClick={() => setMenu(false)}
                >
                  <motion.span
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Admin
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
