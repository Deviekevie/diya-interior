import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BsArrowRight, BsCheckCircle, BsStarFill } from 'react-icons/bs';
import { getReviews } from '../services/api';
import projects from '../../projects';
import Popup from '../Components/Popup/Popup';
import Banner from '../Components/Banner/Banner';
import StickyCTA from '../Components/StickyCTA/StickyCTA';
import { submitContact } from '../services/api';

const Landing = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiReviews = await getReviews();
        setReviews(Array.isArray(apiReviews) ? apiReviews.slice(0, 6) : []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Name, email and message are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });
      setSubmitMessage(res?.message || 'Enquiry submitted successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to send enquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <BsStarFill
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const services = [
    {
      title: 'Modular Kitchens',
      description: 'Custom-designed kitchens that blend functionality with elegance.',
      icon: '🍽️',
    },
    {
      title: 'Living Room Design',
      description: 'Create inviting spaces that reflect your personal style.',
      icon: '🛋️',
    },
    {
      title: 'Wardrobe Solutions',
      description: 'Smart storage solutions for organized living.',
      icon: '👔',
    },
    {
      title: 'TV Unit Design',
      description: 'Modern entertainment centers for your home.',
      icon: '📺',
    },
    {
      title: 'Ceiling Design',
      description: 'Elevate your space with stunning ceiling designs.',
      icon: '✨',
    },
    {
      title: 'Study Room',
      description: 'Productive workspaces designed for focus and comfort.',
      icon: '📚',
    },
  ];

  const whyChoose = [
    {
      title: '10+ Years Experience',
      description: 'Proven track record in interior design',
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored designs for every project',
    },
    {
      title: 'Quality Materials',
      description: 'Premium materials and craftsmanship',
    },
    {
      title: 'Timely Delivery',
      description: 'On-time project completion',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Conversion Elements */}
      <Banner position="top" />
      <Popup delay={3000} scrollThreshold={500} />
      <StickyCTA />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/Images/Home/landing-page-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Crafting <span className="text-brand-purple">Timeless</span> Interiors
            <br />
            for Modern <span className="text-brand-purple">Living</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Transform your space with premium modular solutions. 
            Over 10 years of expertise in creating beautiful, functional interiors.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-brand-dark text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Get Free Consultation
              <BsArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#services"
              className="px-8 py-4 bg-white text-brand-dark rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-brand-purple">Services</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive interior design solutions for every space in your home
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              View All Projects
              <BsArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Featured <span className="text-brand-purple">Projects</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our portfolio of stunning interior transformations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white text-xl font-semibold capitalize">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              View All Projects
              <BsArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="text-brand-purple">Customers Say</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real experiences from clients who trusted Diya Modular
            </p>
          </motion.div>

          {loadingReviews ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id || review.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating || 5)}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.message}"</p>
                  <p className="text-sm font-semibold text-gray-900">- {review.name}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Diya Modular Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="text-brand-purple">Diya Modular</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Excellence in every detail, from design to delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BsCheckCircle className="w-8 h-8 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action / Contact Section */}
      <section id="contact-section" className="py-20 bg-gradient-to-br from-brand-dark to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg mb-8 text-purple-100">
              Get in touch with us for a free consultation and let's bring your vision to life.
            </p>

            <form onSubmit={handleFormSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              {submitError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100">
                  {submitError}
                </div>
              )}
              {submitMessage && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-100">
                  {submitMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  required
                  className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email Address"
                  required
                  className="px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple mb-4"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Tell us about your project..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-purple mb-6 resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-white text-brand-dark rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submitting ? 'Submitting...' : 'Send Enquiry'}
              </button>
            </form>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-purple-100">
              <a href="tel:+919597882019" className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="text-xl">📞</span>
                <span>+91 95978 82019</span>
              </a>
              <a href="mailto:diyamodular@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="text-xl">✉️</span>
                <span>diyamodular@gmail.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
