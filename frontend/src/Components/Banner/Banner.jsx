import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Banner = ({ position = 'top', message = "🎉 Limited Time Offer: Get 15% off on all modular solutions!" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const bannerDismissed = sessionStorage.getItem('diya-banner-dismissed');
    if (bannerDismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('diya-banner-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
          style={position === 'top' ? { top: '80px' } : {}}
          transition={{ duration: 0.4 }}
          className={`fixed ${position === 'top' ? '' : 'bottom-0'} left-0 right-0 z-30 bg-gradient-to-r from-brand-dark to-purple-700 text-white shadow-lg`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm sm:text-base font-medium">
                  {message}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="px-4 py-2 bg-white text-brand-dark rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm whitespace-nowrap"
                >
                  Enquire Now
                </Link>
                <button
                  onClick={handleDismiss}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
