// src/Components/Form/Form.jsx
import React, { useState } from 'react';
import './Form.css';
import { motion } from 'framer-motion';

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, phone, message };

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json(); // fixed typo

      if (res.ok) {
        alert(result.message);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        alert('Failed to send enquiry');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Server error, please try again later');
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
        <form onSubmit={handleSubmit}>
          <div className='form-element'>
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className='form-element'>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className='form-element'>
            <label>Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className='form-element'>
            <label>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} required />
          </div>

          <button type="submit">Submit</button>
        </form>
      </motion.div>
    </div>
  );
};

export default Form; // ✅ default export
