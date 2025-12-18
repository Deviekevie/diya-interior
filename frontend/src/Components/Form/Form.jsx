// src/Components/Form/Form.jsx
import React, { useState } from 'react';
import './Form.css';
import { motion } from 'framer-motion';
import { submitContact } from '../../services/api';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic frontend validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Name, email and message are required.');
      return;
    }

    const data = { name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() };

    try {
      setSubmitting(true);
      const res = await submitContact(data);
      setSuccess(res?.message || 'Enquiry submitted successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting form:', err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to send enquiry. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='contact-page-container'>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Contact <span className='yellow'>us</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className='form-container'
      >
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#fecaca',
                border: '1px solid rgba(248,113,113,0.5)',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#ecfdf3',
                color: '#bbf7d0',
                border: '1px solid rgba(34,197,94,0.4)',
                fontSize: '0.9rem',
              }}
            >
              {success}
            </div>
          )}

          <div className='form-element'>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className='form-element'>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form-element'>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className='form-element'>
            <label>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Form;
