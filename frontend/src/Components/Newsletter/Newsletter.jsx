import { useEffect, useState } from 'react';
import './Newsletter.css';
import { getReviews, createReview } from '../../services/api';

const staticReviews = [
  {
    id: 'static-1',
    name: 'Priya S.',
    rating: 5,
    message:
      'Exceptional service! The design was exactly what we imagined. Timely delivery and great professionalism.',
  },
  {
    id: 'static-2',
    name: 'Naveen K.',
    rating: 5,
    message:
      'Diya Modular transformed our home beautifully. High-quality materials and a very friendly team.',
  },
  {
    id: 'static-3',
    name: 'Anusha R.',
    rating: 5,
    message:
      'Amazing experience! They understood our needs perfectly. Highly recommended for modular interiors.',
  },
];

const Newsletter = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError('');
        // getReviews() now returns the reviews array directly
        const apiReviews = await getReviews();
        setReviews(Array.isArray(apiReviews) ? apiReviews : []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setError('Unable to load recent reviews right now.');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitMessage('');

    if (!name.trim() || !message.trim()) {
      setSubmitError('Please enter your name and review message.');
      return;
    }

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      setSubmitError('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createReview({
        name: name.trim(),
        rating: numericRating,
        message: message.trim(),
      });

      if (res.success && res.review) {
        setReviews((prev) => [res.review, ...prev]);
        setSubmitMessage('Thank you for your review!');
        setName('');
        setRating(5);
        setMessage('');
      } else {
        setSubmitError(res.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      const msg =
        err?.response?.data?.message ||
        'Failed to submit review. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value) => {
    const count = Math.round(Number(value) || 0);
    return '⭐ '.repeat(count || 0).trim();
  };

  const allReviews = [...reviews, ...staticReviews];

  return (
    <div className='container'>
      <div className='review-wrapper'>
        <h1>
          What our<br />
          <span className='yellow'>customers say</span>
        </h1>

        <div className='review-intro'>
          Real experiences from clients who trusted Diya Modular for their dream interiors.
        </div>

        <form className='review-form' onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div className='review-alert review-alert-error'>
              {submitError}
            </div>
          )}
          {submitMessage && (
            <div className='review-alert review-alert-success'>
              {submitMessage}
            </div>
          )}

          <div className='review-form-row'>
            <div className='review-form-field'>
              <label htmlFor="review-name">Name</label>
              <input
                id="review-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className='review-form-field'>
              <label htmlFor="review-rating">Rating</label>
              <select
                id="review-rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={5}>⭐⭐⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={1}>⭐</option>
              </select>
            </div>
          </div>

          <div className='review-form-field'>
            <label htmlFor="review-message">Review</label>
            <textarea
              id="review-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience with Diya Modular"
              rows={3}
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: '1rem', color: '#b91c1c', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        <div className='review-cards'>
          {loading && allReviews.length === 0 && (
            <div className='review-card'>
              <div className='review-skeleton-line' />
              <div className='review-skeleton-line short' />
              <div className='review-skeleton-line' />
            </div>
          )}

          {allReviews.map((review) => (
            <div key={review._id || review.id} className='review-card'>
              <h3>{renderStars(review.rating || 5)}</h3>
              <div className='review-text'>
                “{review.message}”
              </div>
              <span>- {review.name}</span>
              {review.createdAt && (
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#777' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
