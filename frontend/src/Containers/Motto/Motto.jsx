import './Motto.css';
import { motion } from 'framer-motion';

const Motto = () => {
  return (
    <div className='motto-container'>
      <div className='motto-wrapper'>

        {/* Background Animation */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className='motto-bg'
        ></motion.div>

        {/* Motto Text & Image */}
        <div className='moto-text'>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.4 }}
            viewport={{ once: true }}
            className='moto-img'
          >
           
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.2 }}
            viewport={{ once: true }}
          >
            Everything has the<br/>
            potential to be <span className='yellow'>beautiful.</span>
          </motion.h1>
        </div>
      </div>

      {/* About / Description Section */}
      <div className='about-description'>
        <div className='about-wrapper'>

          {/* About Image */}
          <div className='about-img'>
            <img src="/Images/About/about-img.jpg" alt="About" />
          </div>

          {/* About Paragraph */}
          <div className='about-paragraph'>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              With over 10+ years of experience, we bring a skilled eye for details, 
              coupled with flawless execution, to ensure your home or commercial space 
              is a reflection of your individual style. Whether it be a new construction 
              or renovation projects, no matter the scope or size, 
              <span className='yellow'>Diya Modular</span> specializes in custom design 
              solutions tailored specifically for each project. Whether you’re looking 
              for residential or commercial design services, you can trust that your 
              vision will be expertly crafted under our team.
            </motion.p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Motto;
