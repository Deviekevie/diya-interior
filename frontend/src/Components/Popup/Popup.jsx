import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'react-icons/bs';

const Popup = ({ delay = 3000, scrollThreshold = 500 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown (using localStorage for persistence)
    const popupShown = localStorage.getItem('diya-popup-shown');
    if (popupShown === 'true') {
      return;
    }

    // Show after delay
    const delayTimer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
      localStorage.setItem('diya-popup-shown', 'true');
    }, delay);

    // Show after scroll threshold
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('diya-popup-shown', 'true');
        clearTimeout(delayTimer);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delay, scrollThreshold, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to <span className="text-brand-purple">Diya Modular</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Transform your space with our premium interior design solutions. 
                Get a <span className="font-semibold text-brand-purple">free consultation</span> today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/contact"
                  onClick={handleClose}
                  className="px-6 py-3 bg-brand-dark text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Free Consultation
                </Link>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
