import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsTelephone, BsChatDots } from 'react-icons/bs';

const StickyCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Call Button */}
      <motion.a
        href="tel:+919597882019"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Call us"
      >
        <BsTelephone className="w-6 h-6" />
      </motion.a>

      {/* Enquiry Button */}
      <motion.button
        onClick={scrollToContact}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-brand-dark text-white rounded-full font-semibold shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
      >
        <BsChatDots className="w-5 h-5" />
        <span className="hidden sm:inline">Enquire Now</span>
        <span className="sm:hidden">Enquire</span>
      </motion.button>
    </div>
  );
};

export default StickyCTA;
